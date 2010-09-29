	<script type="text/javascript">
		var data = [
			['KeyA', 'Hotel Los Naranjos', '<input type="checkbox" value="1" checked="checked"/>', '<input type="checkbox" value="1" checked="checked"/>', '<?php echo $html->link('Edit', array('controller' => 'phprops', 'action' => 'edit', 'key', '1'), array('target' => '_blank'));?>'],
			['KeyB', 'Hotel Los Naranjos', '<input type="checkbox" value="1" checked="checked"/>', '<input type="checkbox" value="1"/>', '<a href="editor.php?id=2" target="_blank">Editar</a>'],
			['KeyC', 'Hotel Los Naranjos', '<input type="checkbox" value="1"/>', '<input type="checkbox" value="1" checked="checked"/>', '<a href="editor.php?id=3" target="_blank">Editar</a>'],
			['KeyD', 'Hotel Los Naranjos', '<input type="checkbox" value="1"/>', '<input type="checkbox" value="1"/>', '<a href="editor.php?id=4" target="_blank">Editar</a>']
		];
		nano(function() { phprop.table(data); });
	</script>


<div id="phprop-box">
	<div id="phprop-table"></div>
</div>		