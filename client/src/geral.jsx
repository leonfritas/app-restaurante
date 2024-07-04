export const mensagem = (mensagem) => {
  alert(mensagem);
};

export const mensagemPergunta = (mensagemPergunta) => {
  let confirm;
  confirm = window.confirm(mensagemPergunta);
  return confirm;
};
