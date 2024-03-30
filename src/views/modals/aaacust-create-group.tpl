<div class="mb-3">
	<div class="mb-3">
		<label class="form-label text-nowrap fw-bold" >[[groups:new-group.group-name]]</label>
		<input component="group/name" class="form-control" minlength="3" maxlength="45" placeholder="Enter a group name..."/>
	</div>
</div>
<div class="mb-3">
	<label class="form-label text-nowrap fw-bold">[[groups:custom.grouptype.heading]]:</label>
	<div class="form-check">
		<input component="group/create/public" class="form-check-input" type="radio" name="selectGroupType" id="public"
			value="1" checked>
		<label class="form-check-label" for="public">
			[[groups:custom.grouptype.public]]
			<p class="form-text">
				[[groups:custom.grouptypedetails.public]]
			</p>
		</label>
	</div>
</div>
<div class="mb-3">
	<div class="form-check">
		<input component="group/create/private" class="form-check-input" type="radio" name="selectGroupType" id="private"
			value="2">
		<label class="form-check-label" for="private">
			[[groups:details.private]]
			<p class="form-text">
				[[groups:details.private-help]]
			</p>
		</label>
	</div>
</div>
<div class="mb-3">
	<div class="form-check">
		<input component="group/create/locked" class="form-check-input" type="radio" name="selectGroupType" id="locked"
			value="3" {{{ if !user.isAdmin }}} disabled {{{ end }}}>
		<label class="form-check-label" for="locked">
			[[groups:custom.grouptype.premiumlocked]]
			<p class="form-text">
				[[groups:custom.grouptypedetails.premiumlocked]]
			</p>
		</label>
	</div>
</div>
<div class="mb-3">
	<div class="form-check">
		<input component="group/create/hidden" class="form-check-input" type="radio" name="selectGroupType" id="hidden"
			value="4" {{{ if !user.isAdmin }}} disabled {{{ end }}}>
		<label class="form-check-label" for="hidden">
			[[groups:custom.grouptype.premiumhidden]]
			<p class="form-text">
				[[groups:details.hidden-help]]
			</p>
		</label>
	</div>
</div>

{{{ if user.isAdmin }}}
<div class="mb-3">
	<div class="form-check">
		<input component="group/create/open" class="form-check-input" type="radio" name="selectGroupType" id="open"
			value="5">
		<label class="form-check-label" for="open">
			[[groups:custom.grouptype.open]]
			<p class="form-text">
				[[groups:custom.grouptypedetails.open]]
			</p>
		</label>
	</div>
</div>
{{{ end }}}

<div class="mb-3">
	<label class="form-label text-nowrap fw-bold">Optional:</label>
	<div class="form-check">
		<input component="group/create/disablejoin" class="form-check-input" type="checkbox"
			id="disableJoin">
		<label class="form-check-label" for="disableJoin">[[groups:details.disableJoinRequests]]</label>
		<p class="form-text">
		[[groups:custom.groupsettinghelp.disablejoin]]
		</p>
	</div>
</div>