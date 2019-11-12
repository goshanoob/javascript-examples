function показатьЗначение(){
  var номерТела, угол;
  if (this.id != "p"){
    номерТела = (this.id.replace(/\D+/,''));
    угол = this.value;
    document.getElementById('текущийУгол'+номерТела).innerHTML = угол;
	угол = получитьРадианы(угол);
    поворот();
   } else if (this.id == "p"){
     var p = parseFloat(this.value);
	 document.getElementById('текущая_p').value = this.value;
	 угол = Math.asin( ((0.32+p)*(0.32+p)-0.1017)/0.1008 );
	
	 номерТела=3; поворот(); врашениеСхемы(получитьГрадусы(угол));
     номерТела=6; поворот(); врашениеСхемы(получитьГрадусы(угол)); var гамма = получитьРадианы(90)+угол;
	 номерТела=7; угол=-угол; поворот(); врашениеСхемы(получитьГрадусы(угол));  
	 номерТела=4; угол = -Math.asin( (0.0135-(0.32+p)*(0.32+p))/(0.42*(0.32+p)) ); поворот(); 
	 
	 // вычисление двух углов на схеме
	 var альфа = Math.asin(50*Math.sin(гамма)/(Math.sqrt(16900-12000*Math.cos(гамма))));
	 var бэтта = Math.asin(120*Math.sin(гамма)/(Math.sqrt(16900-12000*Math.cos(гамма))));
	 номерТела=4; врашениеСхемы(38.5-получитьГрадусы(альфа));
	 номерТела=5; врашениеСхемы(-43.5+получитьГрадусы(бэтта));
	 
	 var шток = document.getElementById('тело_5');
	 var параметры = шток.getAttribute('translation').split(/\s+/);
     параметры[0] = 0.32 + p;
     шток.setAttribute('translation', параметры.join(' '));  
     

  }
  
  function поворот(){
    
    var тело=document.getElementById('тело_'+номерТела);
    var параметры = тело.getAttribute('rotation').split(/\s+/);
    параметры[3]=угол;
    тело.setAttribute('rotation', параметры.join(' '));  
	
 }
 
  function врашениеСхемы(угол){
    var узел = document.getElementById("узел"+номерТела);
    узел.setAttribute("transform", 'rotate('+-угол+')');
	
    /*document.getElementById("узел11").setAttribute("transform", 'rotate('+(получитьГрадусы(-угол)+73)+')');
    document.getElementById("узел12").setAttribute("transform", 'rotate('+(получитьГрадусы(-угол)+73)+')');
	*/
  }

  
  
  
}

function получитьРадианы(градусы){
  return Math.round((Math.PI/180*parseFloat(градусы))*100)/100;
}

function получитьГрадусы(рад){
  return Math.round((180*parseFloat(рад)/Math.PI)*100)/100;
}
