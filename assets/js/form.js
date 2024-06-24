
const form = document.getElementsByClassName("fCadastro")[0];

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    let form = e.target;
    const formEntries = new FormData(form).entries();
    const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y})));
    
    json["cidade"] = document.getElementById('fCadastroCidade').value;
    json["uf"] = document.getElementById('fCadastroUf').value;
    json["rua"] = document.getElementById('fCadastroRua').value;
    localStorage.setItem('formData',JSON.stringify(json));
    
    window.location.href = "index.html"
});

const cepinput = document.getElementsByClassName("cepinput")[0];
cepinput.addEventListener("keyup",(e)=>{
    e.preventDefault();
    let input = e.target;
    input.value = cepMask(input.value);
});
cepinput.addEventListener("blur",(e)=>{
    e.preventDefault();
    let input = e.target;
    pesquisacep(input.value);
})

const cepMask = (value) => !value ? "" : value.replace(/\D/g,'').replace(/(\d{5})(\d)/,'$1-$2')
const cepAPI = (value) => {
    let cep = valor.replace(/\D/g, '');
}
  


const pesquisacep = (valor) => {

    var cep = valor.replace(/\D/g, '');
    if(!cep) return;
  
    var validacep = /^[0-9]{8}$/;
    if(!validacep.test(cep)){
        alert("Formato de CEP inválido.");
        return;
    }

    let url = 'https://viacep.com.br/ws/'+ cep + '/json/';

    const result = fetch(url)
    .then((response)=> {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Ocorreu um erro ao consultar o CEP');
    })
    .then(data=>{ 
        let inputCidade = document.getElementById('fCadastroCidade')
        let inputUf = document.getElementById('fCadastroUf')
        let inputRua = document.getElementById('fCadastroRua')
        inputCidade.value = data.localidade
        inputUf.value = data.uf
        inputRua.value = data.logradouro
    }).catch((error) => {
        Swal.fire(error, "", "error");
      });
    
    
  
};