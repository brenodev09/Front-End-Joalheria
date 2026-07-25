import { 
  useState,
  useRef
} from "react";

import { 
  gsap 
} from "gsap";

import {
  useGSAP
} from "@gsap/react";

import estilos from "../../styles/User/carrinho.module.css";

import Header from "../../components/Header";

import {
  useCarrinho
} from "../../context/carrinhoContext";


gsap.registerPlugin(useGSAP);



export default function Carrinho(){


const containerRef = useRef(null);



const {

  itens,

  atualizarQuantidade,

  removerProduto,

  subtotal,

  total

} = useCarrinho();





const produtos = itens;





const [etapaAtual,setEtapaAtual] = useState(1);

const [pedidoConfirmado,setPedidoConfirmado] = useState(false);





const [entregaSelecionada,setEntregaSelecionada] = useState("padrao");

const [formaPagamento,setFormaPagamento] = useState("cartao");





const [emailPagamento,setEmailPagamento] = useState("");

const [tentouFinalizarPagamento,setTentouFinalizarPagamento] = useState(false);





const [enderecoForm,setEnderecoForm] = useState({

nome:"",

telefone:"",

endereco:"",

cidade:"",

estado:"",

cep:""

});



const [tentouAvancarEntrega,setTentouAvancarEntrega] = useState(false);







const opcoesEntrega = [


{

id:"padrao",

nome:"Entrega Padrão",

prazo:"5 a 7 dias úteis",

preco:0

},


{

id:"expressa",

nome:"Entrega Expressa",

prazo:"2 a 3 dias úteis",

preco:150

},


{

id:"retirada",

nome:"Retirada em Boutique",

prazo:"Disponível em 24h",

preco:0

}


];









const valorEntrega = 
opcoesEntrega.find(
 opcao=>opcao.id===entregaSelecionada
)?.preco ?? 0;







const totalPedido = total + valorEntrega;









const formatarPreco = (valor)=>{


return Number(valor).toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
);


};









function imagemProduto(imagem){


if(!imagem) return "";



return imagem.startsWith("http")

?

imagem

:

`http://localhost:3000${imagem}`;


}









const totalItens = produtos.reduce(

(total,item)=>

total + Number(item.quantidade),

0

);









const aoMudarCampoEndereco=(evento)=>{


const {

name,

value

}=evento.target;



setEnderecoForm(

anterior=>({

...anterior,

[name]:value

})

);


};








const camposEndereco=[

"nome",

"telefone",

"endereco",

"cidade",

"estado",

"cep"

];








const entregaValida =
camposEndereco.every(

campo=>

enderecoForm[campo].trim() !== ""

);









const emailValido = 
/^\S+@\S+\.\S+$/.test(
emailPagamento.trim()
);







const pagamentoValido = 
formaPagamento==="cartao"
?
true
:
emailValido;









function aoClicarBotaoPrincipal(){


if(produtos.length===0)

return;



if(etapaAtual===1){

setEtapaAtual(2);

return;

}





if(etapaAtual===2){


if(!entregaValida){

setTentouAvancarEntrega(true);

return;

}


setTentouAvancarEntrega(false);

setEtapaAtual(3);


return;


}





if(!pagamentoValido){

setTentouFinalizarPagamento(true);

return;

}



setPedidoConfirmado(true);



}
return (

<main 
className={estilos.pagina}
ref={containerRef}
>


<Header />



<nav className={estilos.stepper}>


<div className={estilos.stepperLinhaBase}>

<div 
className={estilos.linhaProgresso}
style={{
width:
etapaAtual===1
?
"0%"
:
etapaAtual===2
?
"50%"
:
"100%"
}}
/>

</div>



{[
{
numero:1,
label:"Carrinho"
},

{
numero:2,
label:"Entrega"
},

{
numero:3,
label:"Pagamento"
}

].map(etapa=>(


<button

key={etapa.numero}

type="button"

className={estilos.etapa}

disabled


>


<span className={estilos.etapaCirculo}>

{etapa.numero}

</span>


<span className={estilos.etapaTexto}>

{etapa.label}

</span>



</button>


))}



</nav>







<main className={estilos.conteudoPrincipal}>




<h1 className={estilos.titulo}>

{

etapaAtual===1 && "Seu Carrinho"

}

{

etapaAtual===2 && "Informações de Entrega"

}


{

etapaAtual===3 && "Pagamento"

}


</h1>







<div className={estilos.grade}>


<section className={estilos.colunaEsquerda}>



<div className={estilos.conteudoEtapa}>


{/* =========================
        ETAPA CARRINHO
========================= */}



{
etapaAtual===1 && (


<>


{
produtos.length===0

?


<p className={estilos.carrinhoVazio}>

Seu carrinho está vazio.

</p>


:


<div className={estilos.listaProdutos}>


{

produtos.map(produto=>(



<article

key={produto.id}

className={estilos.produtoItem}

>


<div 
className={estilos.produtoImagemWrapper}
>


<img

src={imagemProduto(produto.imagem)}

alt={produto.nome}

className={estilos.produtoImagem}

/>


</div>







<div className={estilos.produtoInfo}>


<div 
className={estilos.produtoCabecalho}
>


<h2 className={estilos.produtoNome}>

{produto.nome}

</h2>



<button

type="button"

className={estilos.botaoRemover}

onClick={()=>removerProduto(produto.id)}

>

Remover

</button>



</div>







<p className={estilos.produtoDescricao}>

{produto.descricao}

</p>







<p className={estilos.produtoAtributos}>


Material:

<strong>

{" "}
{produto.material}

</strong>





{

produto.variacao &&


<>

&nbsp; | &nbsp;

Tamanho:

<strong>

{" "}
{produto.variacao}

</strong>


</>


}



</p>









<div className={estilos.produtoRodape}>


<div 
className={estilos.quantidadeControle}
>



<button

type="button"

className={estilos.quantidadeBotao}

onClick={()=>


atualizarQuantidade(

produto.id,

produto.quantidade-1

)


}

>


−


</button>







<span className={estilos.quantidadeValor}>

{produto.quantidade}

</span>







<button

type="button"

className={estilos.quantidadeBotao}


onClick={()=>


atualizarQuantidade(

produto.id,

produto.quantidade+1

)


}

>


+

</button>



</div>








<div className={estilos.produtoPrecos}>


<span className={estilos.precoAtual}>

{

formatarPreco(

Number(produto.preco)

*

Number(produto.quantidade)

)

}


</span>



</div>







</div>



</div>





</article>



))


}


</div>



}


</>


)

}





{/* =========================
        ENTREGA
========================= */}


{

etapaAtual===2 && (


<div className={estilos.formularioEtapa}>


<h2 className={estilos.formularioTitulo}>

Endereço de Entrega

</h2>





<div className={estilos.formularioGrade}>


{

camposEndereco.map(campo=>(


<label 
key={campo}
className={estilos.campo}
>


<span>

{campo.toUpperCase()}

</span>



<input

name={campo}

value={enderecoForm[campo]}

onChange={aoMudarCampoEndereco}

/>



</label>


))


}



</div>






<h2 className={estilos.formularioTitulo}>

Entrega

</h2>






<div className={estilos.opcoesEntrega}>


{

opcoesEntrega.map(opcao=>(



<label

key={opcao.id}

className={estilos.opcaoEntregaCard}

>


<input

type="radio"

checked={
entregaSelecionada===opcao.id
}

onChange={()=>

setEntregaSelecionada(opcao.id)

}

/>



<span>

{opcao.nome}

</span>



<strong>

{

opcao.preco===0

?

"Grátis"

:

formatarPreco(opcao.preco)

}


</strong>



</label>



))


}



</div>



</div>


)

}






{/* =========================
        PAGAMENTO
========================= */}


{

etapaAtual===3 && (



<div className={estilos.formularioEtapa}>


<h2 className={estilos.formularioTitulo}>

Pagamento

</h2>





<div className={estilos.abasPagamento}>


{

[
"cartao",
"pix",
"boleto"

].map(tipo=>(


<button

key={tipo}

type="button"

className={

formaPagamento===tipo

?

estilos.abaPagamentoAtiva

:

estilos.abaPagamento

}


onClick={()=>setFormaPagamento(tipo)}

>


{tipo}


</button>



))


}



</div>







{

formaPagamento!=="cartao" &&


<input

type="email"

placeholder="Seu email"

value={emailPagamento}

onChange={
e=>setEmailPagamento(e.target.value)
}

/>



}







<h2 className={estilos.formularioTitulo}>

Revisão do pedido

</h2>





{

produtos.map(produto=>(


<div

key={produto.id}

className={estilos.revisaoItem}

>


<img

src={imagemProduto(produto.imagem)}

className={estilos.revisaoImagem}

/>


<span>

{produto.nome}

</span>



<strong>

{

formatarPreco(

produto.preco *

produto.quantidade

)

}


</strong>


</div>



))


}



</div>



)


}



</div>


</section>
{/* =========================
        RESUMO PEDIDO
========================= */}


<aside className={estilos.colunaDireita}>


<div className={estilos.resumoPedido}>


<h2 className={estilos.resumoTitulo}>

Resumo do Pedido

</h2>





<div className={estilos.resumoLinha}>


<span>

Itens no carrinho

</span>


<span>

{totalItens}

</span>



</div>







<div className={estilos.resumoLinha}>


<span>

Subtotal

</span>



<span>

{
formatarPreco(subtotal)
}

</span>



</div>








<div className={estilos.resumoLinha}>


<span>

Entrega

</span>



<span>


{

valorEntrega===0

?

"Grátis"

:

formatarPreco(valorEntrega)

}


</span>



</div>







<div className={estilos.resumoDivisor}/>








<div className={estilos.resumoTotalLinha}>


<span>

Total

</span>



<strong className={estilos.resumoTotalValor}>


{

formatarPreco(totalPedido)

}


</strong>



</div>









<button

type="button"

className={estilos.botaoContinuar}


disabled={produtos.length===0}


onClick={aoClicarBotaoPrincipal}


>


{


etapaAtual===1

?

"Continuar para Entrega"


:

etapaAtual===2

?

"Continuar para Pagamento"


:

"Finalizar Compra"



}



</button>







<p className={estilos.resumoSeguranca}>


Pagamento seguro e criptografado


</p>



</div>



</aside>





</div>


</main>



</main>



);

}