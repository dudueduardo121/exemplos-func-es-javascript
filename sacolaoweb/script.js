let cart = []; //array carrinho compra
let modalQt = 1;
let modalKey = 0;


const x = (e) => document.querySelector(e);
const y = (e) => document.querySelectorAll(e);

// listagem das pizzas
pizzaJson.map((item, i) =>{
    let pizzaItem = x('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', i);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // evento click abrir modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();

        // procura o elemento mais proximo que tenha pizza-item
        let id = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = id;

        //console.log(pizzaJson[id]);

        // brir modal
        x('.pizzaBig img').src = pizzaJson[id].img;
        x('.pizzaInfo h1').innerHTML = pizzaJson[id].name;
        x('.pizzaInfo--desc').innerHTML = pizzaJson[id].description;
        x('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[id].price.toFixed(2)}`;
        

        x('.pizzaInfo--size.selected').classList.remove('selected')
        y('.pizzaInfo--size').forEach((item, index)=>{
            if(index == 2){
                item.classList.add('selected');
            }
            item.querySelector('span').innerHTML = pizzaJson[id].sizes[index];
        });

        x('.pizzaInfo--qt').innerHTML = modalQt;


        x('.pizzaWindowArea').style.opacity = 0;
        x('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            x('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    
    x('.pizza-area').append(pizzaItem);
    
});

// Eventos do modal
function fecharModal(){
    x('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        x('.pizzaWindowArea').style.display = 'none';
    },500);
}

// click botoes cancel e voltar
y('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', fecharModal);
});

// btn menos
x('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt --;
        x('.pizzaInfo--qt').innerHTML = modalQt;
    }

})

// btn mais
x('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt ++;
    x('.pizzaInfo--qt').innerHTML = modalQt;
})

// seleciona tamanho das pizzas
y('.pizzaInfo--size').forEach((item, index) =>{
    item.addEventListener('click', (e)=>{
        x('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');
    });
});

// ação btn carrinho compra

x('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // Qual a pizza
    //console.log("Pizza: " + modalKey); 
    //Tamanho da pizza
    let size = parseInt(x('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log("Tamanho: " + size);
    //Quantidade de Pizzas
    //console.log("Quantidade: " + modalQt);

    let identificador = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>{
        return item.identificador == identificador
    });

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identificador,
            id: pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    atualizarCarrinho();
    fecharModal();
});

// abrir carrinho compra mobile

x('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0){
        x('aside').style.left = '0';
    }
});

x('.menu-closer').addEventListener('click', ()=> {
    x('aside').style.left = '100vw';
});

function atualizarCarrinho(){

    x('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        x('aside').classList.add('show');
        x('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){

            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;


            let cartItem = x('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;           
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //btns
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt --;
                }else{
                    cart.splice(i, 1); //remove o indice;
                }
                atualizarCarrinho();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt ++;
                atualizarCarrinho();
            });

            x('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        x('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        x('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        x('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        x('aside').classList.remove('show');
        x('aside').style.left = '100vw';
    }
}





