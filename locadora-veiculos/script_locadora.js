
(function (){

    const select = (e) => document.querySelector(e);

    function randerGarage(){
        const garage = getGarage();
        select('#garage').innerHTML = '';
        garage.forEach(e =>adicionarCarroGarage(e))
    }

    function convertePeriodo(mil){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`
    }

    function checkOut(info){
        let periodo = new Date() - new Date(info[2].dataset.time);
        periodo = convertePeriodo(periodo);
        const licenca = info[1].textContent;

        const msg = `O veiculo ${info[0].textContent} de placa ${placa} permaneceu estacionado po ${periodo} 
        Deseja encerrar?`;

        if(confirm(msg)) return;

        const garage = getGarage().filter( e => e.placa !== placa);

        localStorage.garage = JSON.stringify(garage);

        randerGarage();

    }

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    randerGarage();

    select('#send').addEventListener("click", ()=>{
        const veiculo = select('#veiculo').value;
        const placa = select('#placa').value;
        
        if(!veiculo || !placa){
            alert("Os campos são obrigatorios");
            return;
        }
        
        const carro = { 
            veiculo, 
            placa, 
            time: new Date()
        }

        // local storage
        const garage = getGarage();
        garage.push(carro);
        localStorage.garage = JSON.stringify(garage)// todo o objeto garage transforma e texto

        console.log(garage);
        adicionarCarroGarage(carro);

        select('#veiculo').value = '';
        select('#placa').value = '';
    });


    function adicionarCarroGarage(carro){
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${carro.veiculo}</td>
            <td>${carro.placa}</td>
            <td data-time="${carro.time}">${new Date(carro.time).toLocaleString("pt-BR", {hour: "numeric", minute: "numeric"})}</td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        select('#garage').appendChild(row)
    };

    select('#garage').addEventListener("click", e =>{
        if(e.target.className == "delete"){
            checkOut(e.target.parentElement.parentElement.cells);
        }
        
    });

})(); 

