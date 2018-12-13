/*
Meu componente está rederizando? OK!
As props passadas estão sendo usadas como esperado?
Caso tenha funcao dentro o componente, ela está funcionando corretamente?
Caso meu componente nao recebe as props ele quebra a aplicação? Por enquanto tratado pelo PropTypes isRequired
Ele possui estado de loading?
*/

import React from 'react';
// Precisamos importar a lib para montar o componente
// existe 3 opções (render, shallow, mount) todos do enzyme lib feita pelo airbnb;
import { shallow } from 'enzyme';
import CardRedefinirSenha from '../CardRedefinirSenha';

/*
  Contexto: describe, it, context (nao muito usado);
  Ciclo de Vida: describe > beforeEach > it > afterEach (mais utilizados);
*/

describe('CardRedefinirSenha', () => {
  // Declarar as constantes utilizadas
  let wrapper = null; // nosso componente wrapper
  const props = {
    alterarSenhaAberto: false,
    dadosRedefinirSenha: { senhaAtual: 'aaa', confirmacaoSenha: 'bbb' },
    alterarSenha: jest.fn(), // jest.fn() é um mock pronto de funcao... mock.calls
    handleClickAlterarSenha: jest.fn(),
  };

  const mountComponent = (newProps = {}) => {
    wrapper = shallow(<CardRedefinirSenha {...props} {...newProps} />);
  };

  beforeEach(() => {
    mountComponent();
  });

  it('Deve renderizar o componente sem erro', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('Props', () => {
    it('Nao deve exibir os inputs caso a props alterarSenhaAberto seja false', () => {
      expect(wrapper.find('#senhaAtual')).toHaveLength(0);
      expect(wrapper.find('#confirmacaoSenha')).toHaveLength(0);
    });

    it('Deve exibir os inputs caso a props alterarSenhaAberto seja true', () => {
      mountComponent({ alterarSenhaAberto: true });
      expect(wrapper.find('#senhaAtual')).toHaveLength(1);
      expect(wrapper.find('#confirmacaoSenha')).toHaveLength(1);
    });

    it('Deve chamar a funcao handleClickAlterarSenha quando clicar no botao', () => {
      expect(props.handleClickAlterarSenha.mock.calls.length).toEqual(0);
      wrapper.find('#botao').simulate('click');
      expect(props.handleClickAlterarSenha.mock.calls.length).toEqual(1);
    });

    it('Deve chamar a funcao alterarSenha quando o input senhaAtual for alterado', () => {
      mountComponent({ alterarSenhaAberto: true });
      expect(props.alterarSenha.mock.calls.length).toEqual(0);
      wrapper.find('#senhaAtual').simulate('change', { target: { value: 'senhaAtual' } });
      expect(props.alterarSenha.mock.calls.length).toEqual(1);
    });

    it('Deve chamar a funcao alterarSenha quando o input confirmacaoSenha for alterado', () => {
      const mockNewProps = { alterarSenhaAberto: true, alterarSenha: jest.fn() };
      mountComponent(mockNewProps);
      expect(mockNewProps.alterarSenha.mock.calls.length).toEqual(0);
      wrapper
        .find('#confirmacaoSenha')
        .simulate('change', { target: { value: 'confirmacaoSenha' } });
      expect(mockNewProps.alterarSenha.mock.calls.length).toEqual(1);
    });

    it('Deve exibir no input o valor recebido na props dadosRedefinirSenha', () => {
      mountComponent({ alterarSenhaAberto: true });
      expect(wrapper.find('#senhaAtual').props().value).toBe(props.dadosRedefinirSenha.senhaAtual);
      expect(wrapper.find('#confirmacaoSenha').props().value).toBe(
        props.dadosRedefinirSenha.confirmacaoSenha,
      );
    });
  });
});
