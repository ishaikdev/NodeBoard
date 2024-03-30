'use strict';

define('forum/groups/list', [
	'forum/infinitescroll', 'benchpress', 'api', 'bootbox', 'alerts', 'translator',
], function (infinitescroll, Benchpress, api, bootbox, alerts, translator) {
	const Groups = {};

	Groups.init = function () {
		infinitescroll.init(Groups.loadMoreGroups);

		// Custom Group creation
		$('button[data-action="new"]').on('click', handleCreate);

		async function handleCreate() {
			let groups = [];
			if (app.user.isAdmin) {
				({ groups } = await api.get('/admin/groups'));
				groups.sort((a, b) => b.system - a.system).map((g) => {
					const { name, displayName } = g;
					return { name, displayName };
				});
			}
			const html = await app.parseAndTranslate('modals/aaacust-create-group', {
				user: app.user,
				groups,
			});

			const modal = bootbox.dialog({
				title: '[[groups:new-group]]',
				message: html,
				onEscape: true,
				buttons: {
					cancel: {
						label: 'Cancel',
						className: 'btn-secondary',
					},
					save: {
						label: '[[global:create]]',
						className: 'btn-primary',
						callback: function () {
							const newGroup = {};
							const groupName = modal.find('[component="group/name"]').val();

							function validateName(name) {
								return /^[\p{L}0-9!\s-]+$/u.test(name);
							}

							if (groupName.trim().length === 0 || !validateName(groupName.trim())) {
								translator.translate('[[groups:custom.groupcreate.errorinvalidname]]', function (translated) {
									alerts.error(translated);
								});
							} else {
								newGroup.name = groupName.trim();
							}
							const groupType1 = modal.find('[component="group/create/public"]').is(':checked');
							const groupType2 = modal.find('[component="group/create/private"]').is(':checked');
							const groupType3 = modal.find('[component="group/create/locked"]').is(':checked');
							const groupType4 = modal.find('[component="group/create/hidden"]').is(':checked');
							const groupType5 = modal.find('[component="group/create/open"]').is(':checked');
							const groupDisableJoin = modal.find('[component="group/create/disablejoin"]').is(':checked');
							if (groupType1) {
								newGroup.private = 0;
								newGroup.public = 1;
							} else if (groupType2) {
								newGroup.private = 1;
							} else if (groupType3) {
								newGroup.private = 1;
								newGroup.locked = 1;
							} else if (groupType4) {
								newGroup.private = 1;
								newGroup.hidden = 1;
							} else if (groupType5) {
								newGroup.private = 0;
								newGroup.hidden = 0;
								newGroup.open = 1;
								newGroup.disableJoinRequests = 1;
							}

							if (groupDisableJoin) {
								newGroup.disableJoinRequests = 1;
							}

							api.post('/groups', newGroup).then((res) => {
								ajaxify.go('groups/' + res.slug);
							}).catch(alerts.error);
							return true;
						},
					},
				},
			});
		}

		const params = utils.params();
		$('#search-sort').val(params.sort || 'alpha');

		// Group searching
		$('#search-text').on('keyup', Groups.search);
		$('#search-button').on('click', Groups.search);
		$('#search-sort').on('change', function () {
			ajaxify.go('groups?sort=' + $('#search-sort').val());
		});
	};

	Groups.loadMoreGroups = function (direction) {
		if (direction < 0) {
			return;
		}

		infinitescroll.loadMore('/groups', {
			sort: $('#search-sort').val(),
			after: $('[component="groups/container"]').attr('data-nextstart'),
		}, function (data, done) {
			if (data && data.groups.length) {
				Benchpress.render('partials/groups/list', {
					groups: data.groups,
				}).then(function (html) {
					$('#groups-list').append(html);
					done();
				});
			} else {
				done();
			}

			if (data && data.nextStart) {
				$('[component="groups/container"]').attr('data-nextstart', data.nextStart);
			}
		});
	};

	Groups.search = function () {
		const groupsEl = $('#groups-list');
		const queryEl = $('#search-text');
		const sortEl = $('#search-sort');

		socket.emit('groups.search', {
			query: queryEl.val(),
			options: {
				sort: sortEl.val(),
				filterHidden: true,
				showMembers: true,
				hideEphemeralGroups: true,
			},
		}, function (err, groups) {
			if (err) {
				return alerts.error(err);
			}
			groups = groups.filter(function (group) {
				return group.name !== 'registered-users' && group.name !== 'guests';
			});
			Benchpress.render('partials/groups/list', {
				groups: groups,
			}).then(function (html) {
				groupsEl.empty().append(html);
			});
		});
		return false;
	};

	return Groups;
});
