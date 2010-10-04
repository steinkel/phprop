	<script type="text/javascript">
		var data = [
		<?php 
		foreach ($props as $key => $prop){
			$defaultValue = $prop['values']['default'];
			$htmCheckbox = "";
			$translatedCheckbox = "";
			if($prop['isHTML']){
				$htmCheckbox = '<input type="checkbox" value="1" checked="checked"/>';
			} else {
				$htmCheckbox = '<input type="checkbox" value="1"/>';
				
			}
			
			if ($prop['isTranslated']){
				$translatedCheckbox = '<input type="checkbox" value="1" checked="checked"/>';
				
			} else {
				$translatedCheckbox = '<input type="checkbox" value="1" />';
				
			}
			
			
			echo "['$key', '$defaultValue', '$htmCheckbox', '$translatedCheckbox', '" . $html->link(__('Edit', true), array('controller' => 'phprops', 'action' => 'edit', $key, $prop['isHTML'], $prop['isTranslated']), array('target' => '_blank')) . "'],";
		} 
		?>
		];
		nano(function() { phprop.table(data); });
	</script>


<div id="phprop-box">
	<div id="phprop-table"></div>
</div>		