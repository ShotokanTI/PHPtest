function createBtnBack() {
    let tTitle = document.getElementById('cep-title')
    let tBody = document.getElementById('cep-data')
    let table = document.querySelector('.table-responsive')
    table.style = "display:block!important"
    let btn = document.createElement('button')
    btn.className = "btn btn-primary"
    btn.innerHTML = 'Buscar outro cep'
    table.appendChild(btn)

    btn.onclick = () => {
        document.getElementById('content-cep').style = "display:block!important"
        table.style = "display:none!important"
        tTitle.innerHTML = ''
        tBody.innerHTML = ''
        btn.remove()
    }
}
function seedTableCep(data) {
    let tTitle = document.getElementById('cep-title')
    let tBody = document.getElementById('cep-data')
    let trTitle = document.createElement('tr')
    let trBody = document.createElement('tr')
    for (title in data) {
        let th = document.createElement('th')
        let thBody = document.createElement('th')
        th.innerHTML += title.toUpperCase()
        thBody.innerHTML += data[title]
        trTitle.appendChild(th)
        trBody.appendChild(thBody)
    }
    tTitle.appendChild(trTitle)
    tBody.appendChild(trBody)
}
function loadingCep(data) {
    document.getElementById('content-cep').style = "display:none!important"
    document.getElementById('l-cep').style = "display:block!important"
    setTimeout(() => {
        document.getElementById('l-cep').style = "display:none!important"
        seedTableCep(data)
        createBtnBack()
    }, 2000)
}

window.onload = function(){
    fetch('./database/config.php')
}

document.getElementById('input-cep').onblur = (event) => {
    //Nova variável "cep" somente com dígitos.
    var cep = event.target.value.replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;
        //Valida o formato do CEP.
        if (validacep.test(cep)) {
            var headers = new Headers({
                'content-type': 'application/json'
            });
            fetch('./controller/CepExist.php', {
                method: 'POST',
                body: JSON.stringify({cep:cep}),
                mode: "cors",
                headers: headers
            })
            .then(response => response.text())
            .then(response => {
                response = JSON.parse(response)
                if(response.status){
                    loadingCep(response.dadosTabela)
                    toastMessage(response.msg, 'success')
                }else{
                    fetch(`https://viacep.com.br/ws/${cep}/xml`)
                .then(response => response.text())
                .then(str => (new DOMParser()).parseFromString(str, "text/xml"))
                .then(data => filterXml(data))
                .catch(() => toastMessage('Cep invalido', 'error'))
                }
            })
        }
        else {
            toastMessage('Cep invalido', 'error')
        }
    }
}
function iterateXml(xmlTitle, data) {
    let arrayXml = {}
    for (let i = 0; i < xmlTitle.length; i++) {
        let nodeValue = data.getElementsByTagName(xmlTitle[i])[0].childNodes[0]
        if (nodeValue !== undefined) {
            arrayXml[xmlTitle[i]] = data.getElementsByTagName(xmlTitle[i])[0].childNodes[0].nodeValue
        }
    }
    return (arrayXml)
}
function filterXml(data) {
    let xmlTitle = ["cep",
        "logradouro",
        "complemento",
        "bairro",
        "localidade",
        "uf",
        "ibge",
        "ddd",
        "siafi"]
    let dataXml = iterateXml(xmlTitle, data)
    sendXml(dataXml)
}
function sendXml(data) {
    var headers = new Headers({
        'content-type': 'application/json'
    });
    fetch('./controller/DatabaseController.php', {
        method: 'POST',
        body: JSON.stringify(data),
        mode: "cors",
        headers: headers
    }).then((response) => {
        return response.text()
    }).then(response => {
        response = JSON.parse(response)
        if (response.status) {
            toastMessage(response.msg, 'success')
            // dados do via cep
            loadingCep(data)
        } else {
            toastMessage(response.msg, 'success')
            //dados existentes do banco mysql
            loadingCep(response.dadosTabela)
        }
    })
}


function toastMessage(msg, tipo) {
    $('.toast').toast('show')
    $('.toast-body').text(msg)
    if (tipo === 'error') {
        $('.toast').removeClass('bg-primary')
        $('.toast').removeClass('bg-success')
        $('.toast').addClass('bg-danger')
    } else {
        $('.toast').removeClass('bg-primary')
        $('.toast').removeClass('bg-danger')
        $('.toast').addClass('bg-success')
    }
}