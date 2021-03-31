observador();
var estado=false;
var urlProfile="https://images.vexels.com/media/users/3/147103/isolated/lists/e9bf9a44d83e00b1535324b0fda6e91a-icono-de-linea-de-perfil-de-instagram.png";
const db= firebase.firestore();
const actUsuario=(id, usuarioActualizado)=> db.collection('usuarios').doc(id).update(usuarioActualizado);
function registrar(){
    console.log("diste un click");
    var email=document.getElementById('correo').value;
    var contraseña=document.getElementById('contraseña').value;
    var confirmarContraseña=document.getElementById('confirmarContra').value;
    if(contraseña!=confirmarContraseña){
        alert("las conytraseñas no coinciden");
    }else{
       firebase.auth().createUserWithEmailAndPassword(email, contraseña)
    .then((user) => {
        alert("registrado correctamente.");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage)
        if (errorCode=="auth/email-already-in-use"){
          aviso=document.getElementById("sugerencias");
          aviso.innerHTML=`<div>
          <p id="sugerencia">el correo ya está en uso</p>
          </div>`;}
        if(errorCode=="auth/weak-password"){
          aviso=document.getElementById("sugerencias");
          aviso.innerHTML=`<div>
          <p id="sugerencia">la contraseña es demasiado débil</p>
          </div>`;
        }
  }); 
    }
  
    
}
function ingreso(){
    var email=document.getElementById('correo2').value;
    var password=document.getElementById('contraseña2').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    console.log("ingresó")
    window.location.href="main.html#una";
    console.log("cambió de pag");
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode=="auth/wrong-password"){
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="sugerencia">la contraseña es incorrecta</p>
      </div>`;
    }if(errorCode=="auth/invalid-email"){
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="sugerencia">el correo es incorrecto</p>
      </div>`;
    }if(errorCode=="auth/user-not-found"){
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="sugerencia">usted no tiene una cuenta</p>
      </div>`;
    }
    console.log(errorCode, errorMessage);
  });
}
var datosU=[];
var docId;
var IdInsti;
function observador(){


  firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;
    console.log("existe usuario activo");
    
    db.collection("usuarios").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var datos=doc.data();
            
            datosU[0]=datos.nombre;
            datosU[1]=datos.apellido;
            datosU[2]=datos.institucion;
            if(datosU.length==3){
              estado=true;
              console.log("ya existe un usuario con este ID");
              nombre=document.getElementById('nombre');
              apellido=document.getElementById('apellido');
              institucion=document.getElementById('institucion');
              perfil=document.getElementById('image')
              btnActu=document.getElementById('btn-task-form');
              btnActu.value="actualizar";
              nombre.value=datosU[0];
              apellido.value=datosU[1];
              institucion.value=datosU[2];
              console.log(datosU[2])
              perfil.src=datos.urlProfile;
              urlProfile=datos.urlProfile;
              docId=doc.id;
            }
        });
    })
    .catch((error) => {
        console.log("id's inexistentes");
    });
    try{
      const contenedor2=document.getElementById("logout");
      contenedor2.innerHTML=
      `<hr><br><br><img width="10%" title="Cerrar sesión" onclick="cerrarS()" src="img/logout.png">
      <p>cerrar sesión</p>
      <br><br><hr><br>
      <img width="12%" title="Editar Perfil" onclick="editarPerfil()" src="img/usuario.png">
      <p>perfil</p>
      <br><br><hr><br>
      <img width="12%" title="Agregar Publicacion" onclick="agregarPublicacion()" src="https://www.flaticon.es/svg/vstatic/svg/2311/2311991.svg?token=exp=1617135484~hmac=195e0f1b1c80ccc275ae922cc9bb3863">
      <p>Agregar Publicacion</p>
      `;
    }catch{
      console.log("ventana incorrecta");
    }
    
    
    
    
   
    
  } else {
    try{
      const contenedor=document.getElementById("login");
    contenedor.innerHTML=`<div>
        <button onclick="inicioSesion()" href="index.html">iniciar sesión</button>
    </div>`;
    }catch{
      console.log("ventana incorecta");
    }
    
    
    
  }
});
}
observador();

function agregarPublicacion(){
  window.location.href="publicar.html";
  
}
function back(){
  window.location.href="main.html#tres";
}
function inicioSesion(){
  window.location.href="index.html";
}
function editarPerfil(){
  window.location.href="editarPerfil.html";
}
function cerrarS(){
    console.log("holis");
    firebase.auth().signOut()
    .then(function(){
        console.log("salió");
        window.location.href="index.html";
    })
    .catch(function(error){
        console.log("no salió");
    })
}

function listener (){
    observador();
    if (!estado){
      event.preventDefault();
      nombre=document.getElementById('nombre').value;
      apellido=document.getElementById('apellido').value;
      institucion=document.getElementById('institucion').value;
      
      db.collection('usuarios').doc().set({
          uid,
          nombre,
          apellido,
          institucion,
          urlProfile
     })
      }
      
      else{
          observador();
          event.preventDefault();
          nombre3=document.getElementById('nombre').value;
          apellido3=document.getElementById('apellido').value;
          institucion3=document.getElementById('institucion').value;
          imageElement=document.getElementById('image');
          actUsuario(docId,{
             nombre:nombre3,
             apellido:apellido3,
             institucion:institucion3,
             urlProfile:urlProfile
          })
          nombre.value=datosU[0];
          apellido.value=datosU[1];
          institucion.value=datosU[2];
          idIns=datosU[2];
          imageElement.url=urlProfile;
      }
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="aviso">perfil actualizado exitosamente</p>
      </div>`;
}
function onUpload(e){
    console.log("subir",e);
}
function uploadImage()
{
    try{
      const ref=firebase.storage().ref();
    const file=document.getElementById('photo').files[0];
    var hoy=new Date();
    hora=hoy.getHours()+':'+hoy.getSeconds()+':'+hoy.getMinutes();
    horaFecha=hoy.getDate() + ':' + ( hoy.getMonth() + 1 ) + ':' + hoy.getFullYear()+':'+hora;
    const name=file.name+':'+horaFecha;
    if(file == null){
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="sugerencia">debe seleccionar una imagen</p>
  </div>`;
    }else{
        const metadata={
            contentType:file.type
        }
        const task=ref.child(name).put(file,metadata);
        task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            
            aviso=document.getElementById("sugerencias");
            aviso.innerHTML=`<div>
            <p id="aviso">imagen subida corectamente</p>
            </div>`;
            var imageElement=document.getElementById('image');
            urlProfile=url;
            imageElement.src=url;
        });

        }
    }catch{
      aviso=document.getElementById("sugerencias");
      aviso.innerHTML=`<div>
      <p id="sugerencia">debe seleccionar una imagen</p>
      </div>`;
    }
    
        }


function HacerPublicacion(){
  event.preventDefault();
  
  observador();
  if (estado){
    
    nombreO=document.getElementById('nombreObjeto').value;
    descripcionO=document.getElementById('descriObejto').value;
    ubicaObjeto=document.getElementById('ubiObjeto').value;
      
      var InsId=datosU[2];
    db.collection('publicaciones').doc().set({
        nombreO,
        descripcionO,
        ubicaObjeto,
        uid,
        InsId,
        urlProfile
   })
   aviso=document.getElementById("sugerencias");
        aviso.innerHTML=`<div>
        <p id="aviso">publicado correctamente</p>
        </div>`;
        
        
  }else{
    aviso=document.getElementById("sugerencias");
        aviso.innerHTML=`<div>
        <p id="sugerencia">usted no ha actualizado su perfil</p>
        </div>`;
  }
    nombreO=document.getElementById('nombreObjeto');
    descripcionO=document.getElementById('descriObejto');
    ubicaObjeto=document.getElementById('ubiObjeto');
    nombreO.value="";
    descripcionO.value="";
    ubicaObjeto.value="";

}