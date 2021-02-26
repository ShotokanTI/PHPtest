document.getElementById('input-cep').onkeyup = (event) => {
    //Nova variável "cep" somente com dígitos.
    var cep = event.target.value.replace(/\D/g, '');
    console.log(cep)
    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {
            fetch(`https://viacep.com.br/ws/${cep}/xml`)
            .then(response=>response.text())
            .then(str => (new DOMParser()).parseFromString(str, "text/xml"))
            .then(data=>console.log(data))
        }
        else {
            //cep é inválido.
        }
    }
}

// document.getElementById('input-cep').onkeyup = (e) => {
//     var headers = new Headers({
//         "Content-Type": "application/x-form-urlencoded"
//     });
//     fetch('./controller/searchCep.php', {
//         method: 'POST',
//         body: e.target.value,
//         mode: "cors",
//         headers: headers
//     });

// }