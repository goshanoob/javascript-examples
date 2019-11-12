var m01, m02, m03, m04, m05, m06, m07, m08, cx1, cx2, cx3, cx4, cx5, cx6, cx7, cx8, 
cy1, cy2, cy3, cy4, cy5, cy6, cy7, cy8, cz1, cz2, cz3, cz4, cz5, cz6, cz7, cz8, 
tx1, tx2, tx3, tx4, tx5, tx6, tx7, tx8, ty1, ty2, ty3, ty4, ty5, ty6, ty7, ty8, 
tz1, tz2, tz3, tz4, tz5, tz6, tz7, tz8, g = 9.8;
onload = function(){
  var ползунки = document.getElementsByName('ползунок');
  for(var i=0; i<ползунки.length; i++){
    ползунки[i].addEventListener('input', показатьЗначение, false);
  }
  document.getElementById('вычислитьПараметры').addEventListener('click', вычислитьРезультаты, false);

  var подключения = document.getElementsByTagName('Inline'),
  трасформаторы = document.getElementsByTagName('Transform'), перенос=[], ЦМ=[];
  // взять массы звеньев
  m01 = +подключения[1].getAttribute('масса'); 
  m02 = +подключения[2].getAttribute('масса');
  m03 = +подключения[3].getAttribute('масса');
  m04 = +подключения[4].getAttribute('масса');
  m05 = +подключения[5].getAttribute('масса');
  m06 = +подключения[6].getAttribute('масса');
  m07 = +подключения[7].getAttribute('масса'); 
  m08 = +подключения[8].getAttribute('масса');
  for(var i=1; i<подключения.length; i++){
    ЦМ[i]=[]; перенос[i]=[];
    ЦМ[i] = подключения[i].getAttribute('координатыЦМ').split(/,\s*/);
    перенос[i] = трасформаторы[i].getAttribute('translation').split(/,\s*/);
  }
  // взять координаты центров масс звеньев
  cx1 = +ЦМ[1][0]; cx2 = +ЦМ[2][0]; cx3 = +ЦМ[3][0]; cx4 = +ЦМ[4][0]; cx5 = +ЦМ[5][0]; 
  cx6 = +ЦМ[6][0]; cx7 = +ЦМ[7][0]; cx8 = +ЦМ[8][0]; cy1 = +ЦМ[1][1]; cy2 = +ЦМ[2][1]; 
  cy3 = +ЦМ[3][1]; cy4 = +ЦМ[4][1]; cy5 = +ЦМ[5][1]; cy6 = +ЦМ[6][1]; cy7 = +ЦМ[7][1]; 
  cy8 = +ЦМ[8][1]; cz1 = +ЦМ[1][2]; cz2 = +ЦМ[2][2]; cz3 = +ЦМ[3][2]; cz4 = +ЦМ[4][2]; 
  cz5 = +ЦМ[5][2]; cz6 = +ЦМ[6][2]; cz7 = +ЦМ[7][2]; cz8 = +ЦМ[8][2];  
  // взять txi, tyi, tzi
  tx1 = +перенос[1][0]; tx2 = +перенос[2][0]; tx3 = +перенос[3][0]; tx4 = +перенос[4][0];
  tx5 = +перенос[5][0]; tx6 = +перенос[6][0]; tx7 = +перенос[7][0]; tx8 = +перенос[8][0];
  ty1 = +перенос[1][1]; ty2 = +перенос[2][1]; ty3 = +перенос[3][1]; ty4 = +перенос[4][1];
  ty5 = +перенос[5][1]; ty6 = +перенос[6][1]; ty7 = +перенос[7][1]; ty8 = +перенос[8][1];
  tz1 = +перенос[1][2]; tz2 = +перенос[2][2]; tz3 = +перенос[3][2]; tz4 = +перенос[4][2];
  tz5 = +перенос[5][2]; tz6 = +перенос[6][2]; tz7 = +перенос[7][2]; tz8 = +перенос[8][2];
}

function вычислитьРезультаты(){
  // взять массу груза из входных данных
  var mg = +document.getElementById('массаГруза').value,
  // вычислить массы подсистем
  m8 = m08 + mg, m7 = m07 + m8, m6 = m06 + m7; m5 = m05,
  m4 = m04 + m5, m3 = m03, m2 = m02 + m3 + m4 + m6, m1 = m01 + m2;
  // взять текущие углы, вычислить синусы и косинусы текущих углов
  var трасформаторы = document.getElementsByTagName('Transform'), q=[], s=[], c=[];
  for(var i=1; i<трасформаторы.length; i++){
    q[i] = трасформаторы[i].getAttribute('rotation').split(/\s+/)[3];
	s[i] = Math.sin(q[i]); c[i] = Math.cos(q[i]);
  }
  // вычислить проекции статических моментов
  var mx8 = m08*cx8, my8 = m08*cy8, mz8 = m08*cz8,
  mx7 = m07*cx7 + m8*tx8 + m08*cx8*c[8]+m08*cz8*s[8], 
  my7 = m07*cy7 + m8*ty8 + m08*cy8, 
  mz7 = m07*cz7 + m8*tz8 + m08*cz8*c[8] - m8*cx8*s[8],
  mx6 = m06*cx6 + m7*tx7 + mx7*c[6] + my7*s[6],
  my6 = m06*cy6 + m7*ty7 + my7*c[6] - mx7*s[6],
  mz6 = m06*cz6 + m7*tz7 + mz7,
  mx5 = m05*cx5, my5 = m05*cy5, mz5 = m05*cz5,
  mx4 = m04*cx4 + m5*tx5 + mx5,
  my4 = m04*cy4 + m5*ty5 + my5, mz4 = m04*cz4 + m5*tz5 + mz5,
  mx3 = m03*cx3, my3 = m03*cy3, mz3 = m03*cz3,
  mx2 = m02*cx2 + m3*tx3 + mx3*c[3] - my3*s[3] + m4*tx4 + mx4*c[4] - my4*s[4] + m6*tx6 + mx6*c[6] - my6*s[6],
  my2 = m02*cy2 + m3*ty3 + mx3*s[3] + my3*c[3] + m4*ty4 + mx4*s[4] + my4*c[4] + m6*ty6 + mx6*s[6] + my6*c[6],
  mz2 = m02*cz2 + m3*tz3 + mz3 + m4*tz4 + mz4 + m6*tz6 + mz6,
  mx1 = m01*cx1 + m2*tx2 + mx2, my1 = m01*cy1 + m2*ty2 + my2, mz1 = m01*cz1 + m2*tz2 + mz2,
  // вычислить силы
  Fy8 = 10*m8, F9=-100*mx7/c[6], Fx7=-F9, Fy7 = 10*m7,
  //вычислить моменты сил

  F1 = -g * m1,  F2 = -g * m2,   F8 = -g * m8,
  Mx1 = -g * mz1,  Mz1 = g * mx1,  Mx2 = -g * mz2,
  Mz2 = g * mx2,  Mx8 = -g * mz8,  Mz8 = g * mx8;
  
  document.getElementById("осевСила1").innerHTML = F1.toFixed(3);
  document.getElementById("осевСила2").innerHTML = F2.toFixed(3);
  document.getElementById("осевСила3").innerHTML = F8.toFixed(3);
  
  document.getElementById("изгибМомент1").innerHTML = Mz1.toFixed(3);
  document.getElementById("изгибМомент2").innerHTML = Mz2.toFixed(3);
  document.getElementById("изгибМомент3").innerHTML = Mz8.toFixed(3);
  
  document.getElementById("крутящийМомент1").innerHTML = Mx1.toFixed(3);
  document.getElementById("крутящийМомент2").innerHTML = Mx2.toFixed(3);
  document.getElementById("крутящийМомент3").innerHTML = Mx8.toFixed(3);
  
  
  if(Mx1<0){
    document.getElementById('поворот11').setAttribute('transform', "rotate(180)");
    document.getElementById('вектор11').setAttribute('width', -Mx1/20);
    document.getElementById('вектор12').setAttribute('transform','translate('+(-Mx1/20+5)+',0)');  
    document.getElementById('длина11').innerHTML = Mx1.toFixed(0);
    document.getElementById('длина11').setAttribute('transform', "rotate(180)");
} else{
  document.getElementById('вектор11').setAttribute('width', Mx1/20);
  document.getElementById('вектор12').setAttribute('transform','translate('+(Mx1/20+5)+',0)');
  document.getElementById('длина11').innerHTML = Mx1.toFixed(0);
  }
  
  
  
  
  if(F1<0){
    document.getElementById('поворот13').setAttribute('transform', "rotate(180)");
    document.getElementById('вектор13').setAttribute('height', -F1/20);
    document.getElementById('вектор14').setAttribute('transform','translate(0,'+-F1/20+')');  
    document.getElementById('длина13').innerHTML = F1.toFixed(0);
    document.getElementById('длина13').setAttribute('transform', "rotate(180)");
} else{
    document.getElementById('вектор13').setAttribute('height', F1/20);
    document.getElementById('вектор14').setAttribute('transform','translate(0,'+F1/20+')');  
    document.getElementById('длина13').innerHTML = F1.toFixed(0);
  }

  if(Mz1<0){
	document.getElementById('skewY15').setAttribute('transform','skewY(-45) rotate(180)');
    document.getElementById('вектор15').setAttribute('width', -Mz1/20);
    document.getElementById('вектор16').setAttribute('transform','translate('+Mz1/20+',0)');
	document.getElementById('длина15').innerHTML = Mz1.toFixed(0);
	document.getElementById('длина15').setAttribute('transform','skewY(45) rotate(180)');
  } else {
    document.getElementById('вектор15').setAttribute('width', Mz1/20);
    document.getElementById('вектор16').setAttribute('transform','translate('+(-Mz1/20)+',0)');
	document.getElementById('длина15').innerHTML = Mz1.toFixed(0);
  }


  if(Mx2<0){
    document.getElementById('поворот17').setAttribute('transform', "rotate(180)");
    document.getElementById('вектор17').setAttribute('width', -Mx2/20);
    document.getElementById('вектор18').setAttribute('transform','translate('+(-Mx2/20+5)+',0)');  
    document.getElementById('длина17').innerHTML = Mx2.toFixed(0);
    document.getElementById('длина17').setAttribute('transform', "rotate(180)");
} else{
  document.getElementById('вектор17').setAttribute('width', Mx2/20);
  document.getElementById('вектор18').setAttribute('transform','translate('+(Mx2/20+5)+',0)');
  document.getElementById('длина17').innerHTML = Mx2.toFixed(0);
  }
  

    if(F2<0){
    document.getElementById('поворот19').setAttribute('transform', "rotate(180)");
    document.getElementById('вектор19').setAttribute('height', -F2/20);
    document.getElementById('вектор110').setAttribute('transform','translate(0,'+-F2/20+')');  
    document.getElementById('длина19').innerHTML = F2.toFixed(0);
    document.getElementById('длина19').setAttribute('transform', "rotate(180)");
} else{
  document.getElementById('вектор19').setAttribute('height', F2/20);
  document.getElementById('вектор110').setAttribute('transform','translate(0,'+(F2/20)+')');  
  document.getElementById('длина19').innerHTML = F2.toFixed(0);
  }
  
	
   /* document.getElementById('вектор111').setAttribute('width', Mz2/20);
  document.getElementById('вектор112').setAttribute('transform','translate('+(-Mz2/20)+',0)');
  document.getElementById('длина111').innerHTML = Mz2.toFixed(0);  */
  
  if(Mz2<0){
	document.getElementById('skewY111').setAttribute('transform','skewY(-45) rotate(180)');
    document.getElementById('вектор111').setAttribute('width', -Mz2/20);
    document.getElementById('вектор112').setAttribute('transform','translate('+Mz2/20+',0)');
	document.getElementById('длина111').innerHTML = Mz2.toFixed(0);
	document.getElementById('длина111').setAttribute('transform','skewY(45) rotate(180)');
  } else {
    document.getElementById('вектор111').setAttribute('width', Mz2/20);
    document.getElementById('вектор112').setAttribute('transform','translate('+(-Mz2/20)+',0)');
	document.getElementById('длина111').innerHTML = Mz2.toFixed(0);
  }
  
  
  
  if(Mx8<0){
	document.getElementById('поворот31').setAttribute('transform','rotate(180)');
    document.getElementById('вектор31').setAttribute('width', -Mx8/20);
    document.getElementById('вектор32').setAttribute('transform','translate('+-Mx8/20+',0)');
	document.getElementById('длина31').innerHTML = Mx8.toFixed(0);
	document.getElementById('длина31').setAttribute('transform','rotate(180)');
  } else {
    document.getElementById('вектор31').setAttribute('width', Mx8/20);
    document.getElementById('вектор32').setAttribute('transform','translate('+(Mx8/20+5)+',0)');
    document.getElementById('длина31').innerHTML = Mx8.toFixed(0);
  }
  
  if(F8<0){
	document.getElementById('поворот33').setAttribute('transform','rotate(180)');
    document.getElementById('вектор33').setAttribute('height', -F8/20);
    document.getElementById('вектор34').setAttribute('transform','translate(0,'+(-F8/20)+')');
	document.getElementById('длина33').innerHTML = F8.toFixed(0);
	document.getElementById('длина33').setAttribute('transform','rotate(180)');
  } else {
    document.getElementById('вектор33').setAttribute('height', F8/20);
    document.getElementById('вектор34').setAttribute('transform','translate(0,'+(F8/20)+')');  
    document.getElementById('длина33').innerHTML = F8.toFixed(0);
  }
  
  if(Mz8<0){
	document.getElementById('skew35').setAttribute('transform','skewY(-45) rotate(180)');
    document.getElementById('вектор35').setAttribute('width', -Mz8/20);
    document.getElementById('вектор36').setAttribute('transform','translate('+Mz8/20+',0)');
	document.getElementById('длина35').innerHTML = Mz8.toFixed(0);
	document.getElementById('длина35').setAttribute('transform','skewY(45) rotate(180)');
  } else {
    document.getElementById('вектор35').setAttribute('width', Mz8/20);
    document.getElementById('вектор36').setAttribute('transform','translate('+(-Mz8/20)+',0)');
    document.getElementById('длина35').innerHTML = Mz8.toFixed(0);    
  }
	
  

  
  var плечо = +document.getElementById('плечо').value, xc = плечо / 1000,
  люфт_1 = +document.getElementById('люфт_1').value,
  люфт_2 = +document.getElementById('люфт_2').value,
  люфт_3 = +document.getElementById('люфт_3').value,
  база_1 = +document.getElementById('база_1').value,
  база_2 = +document.getElementById('база_2').value,
  база_3 = +document.getElementById('база_3').value,
  L_1 = 1.3 * (1500 + плечо),
  dy_1 = 2 * L_1 * люфт_1 / (1000 * база_1),
  L_2 = 1.2 * (900 + плечо),
  dy_2 = 2 * L_2 * люфт_2 / (1000 * база_2),
  L_3 = 1.1 * (100 + плечо),
  dy_3 = 2 * L_3 * люфт_3 / (1000 * база_3);
  
  var L = 0.5, La = 0.1, Lb = 0.24, Lc = 0.16, Ld = 0.56,
  Fr3y = L * m03 * g * c[3], Fr9y = Fr3y, 
  Fr4y = L * m4 * g * c[4],  Fr5y = Fr4y, 
  Fr9x = (Fr3y * s[3] - 10 * g * m7 * xc)/c[3],
  Fr7y = xc * m7 * g * s[3] / La + (Fr9y * c[3] + Fr9x * s[3] + m7 * g) * c[3],
  Fr7x = (Fr9y * c[3] + Fr9x * s[3] + m7 * g) * s[3] - xc * m7 * g * c[3] / La,
  s43 = Math.sin(q[4]-q[3]), c43 = Math.cos(q[4]-q[3]),
  Fr5x = (-Fr7y - m06 * g * c[3] - Lb * Fr5y * c43) / s43,
  Fr6y = (-Ld * Fr7y - Lc * m06 * g * c[3]) / Lb,
  Fr6x = Fr7x + m06 * g * s[3] + Fr5x * c43 - Fr5y * s43,
  
  Fr3x = m03 * g * s[3] - Fr9x,
  Fr4x = m4 * g * s[4] - Fr5x; 
 
 // document.getElementById('общаяОшибкаЛюф').value = (dy_1 + dy_2 + dy_3).toFixed(3);
 // document.getElementById('ошибкаЛюф1').value = dy_1.toFixed(3);
  //document.getElementById('ошибкаЛюф2').value = dy_2.toFixed(3);
  //document.getElementById('ошибкаЛюф3').value = dy_3.toFixed(3);
  

  
  var вектор=[], длина = [], угол = [];

  вектор = вычислитьВектор(Fr3x, Fr3y);
  длина[3] = вектор[0];
  угол[3] = -вектор[1]+90;
  document.getElementById('вектор23').setAttribute('height', длина[3]/20);
  document.getElementById('поворот23').setAttribute('transform','rotate('+(180+угол[3])+')');
  document.getElementById('перенос23').setAttribute('transform','translate(-3,'+-длина[3]/20+')');
  var длина23 = document.getElementById('длина23');
 // длина23.setAttribute('transform','translate('+(Fr9y+130)+','+-(Fr9x+10)+')');
  длина23.innerHTML = длина[3].toFixed(0);

  вектор = вычислитьВектор(Fr4x, Fr4y);
  длина[4] = вектор[0];
  угол[4] = вектор[1];	
  document.getElementById('вектор24').setAttribute('height', длина[4]/20);
  document.getElementById('поворот24').setAttribute('transform','rotate('+(180+угол[4])+')');
  document.getElementById('перенос24').setAttribute('transform','translate(-3,'+-длина[4]/20+')');
  var длина24 = document.getElementById('длина24');
 // длина23.setAttribute('transform','translate('+(Fr9y+130)+','+-(Fr9x+10)+')');
  длина24.innerHTML = длина[4].toFixed(0);

  
  вектор = вычислитьВектор(Fr5x, Fr5y);
  длина[5] = вектор[0];
  угол[5] = -вектор[1]+90;	
  document.getElementById('вектор25').setAttribute('height', длина[5]/20);
  document.getElementById('поворот25').setAttribute('transform','rotate('+(угол[5])+')');
  document.getElementById('перенос25').setAttribute('transform','translate(-3,'+-длина[5]/20+')');
  var длина25 = document.getElementById('длина25');
 // длина25.setAttribute('transform','translate('+(Fr5y+130)+','+-(Fr5x+10)+')');
  длина25.innerHTML = длина[5].toFixed(0);
  
  вектор = вычислитьВектор(Fr6x, Fr6y);
  длина[6] = вектор[0];
  угол[6] = -вектор[1]+90;	
  document.getElementById('вектор26').setAttribute('height', длина[6]/20);
  document.getElementById('поворот26').setAttribute('transform','rotate('+(угол[6])+')');
  document.getElementById('перенос26').setAttribute('transform','translate(-3,'+-длина[6]/20+')');
  var длина26 = document.getElementById('длина26');
  //длина26.setAttribute('transform','translate('+(Fr6y+130)+','+-(Fr6x+10)+')');
  длина26.innerHTML = длина[6].toFixed(0);
  
  вектор = вычислитьВектор(Fr7x, Fr7y);
  длина[7] = вектор[0];
  угол[7] = -вектор[1]+90;	
  document.getElementById('вектор27').setAttribute('height', длина[7]/20);
  document.getElementById('поворот27').setAttribute('transform','rotate('+угол[7]+')');
  document.getElementById('перенос27').setAttribute('transform','translate(-3,'+-длина[7]/20+')');
  var длина27 = document.getElementById('длина27');
 // длина27.setAttribute('transform','translate('+(Fr7y+130)+','+-(Fr7x+10)+')');
  длина27.innerHTML = длина[7].toFixed(0);
  
  вектор = вычислитьВектор(Fr9x, Fr9y);
  длина[9] = вектор[0];
  угол[9] = -вектор[1]+90;
  document.getElementById('вектор29').setAttribute('height', длина[9]/20);
  document.getElementById('поворот29').setAttribute('transform','rotate('+(угол[9])+')');
  document.getElementById('перенос29').setAttribute('transform','translate(-3,'+-длина[9]/20+')');
  var длина29 = document.getElementById('длина29');
 // длина29.setAttribute('transform','translate('+(Fr9y+130)+','+-(Fr9x+10)+')');
  длина29.innerHTML = длина[9].toFixed(0);
  
  
  function вычислитьВектор(Frx, Fry){
    var вектор = [];
    вектор[0] = Math.sqrt(Frx*Frx+Fry*Fry);
    вектор[1] = Math.atan(Fry/Frx)/Math.PI*180;
    return вектор;
  }
  
}