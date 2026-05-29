'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Saudações. Sou o SegurAI, seu concierge dedicado para assuntos securitários. Como posso lhe ser útil neste momento?',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Erro: ${data.error}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erro ao conectar com o servidor. Tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-background text-on-surface antialiased font-body-main selection:bg-secondary selection:text-on-secondary">
      {/* TopNavBar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline shadow-sm">
        <div className="flex justify-between items-center w-full px-sm md:px-lg py-sm max-w-container-max mx-auto">
          <div className="flex items-center gap-sm">
            <img
              alt="SegurAI Logo"
              className="h-12 w-auto"
              src="https://lh3.googleusercontent.com/aida/ADBb0uil7Z6ZPJKGcZq5oJIZzE0ezKhpFwm-5-nFlkcH9oPztTqIuOINAlHTM1jfY8elvtwIYcDznfHiwXf9ycx9HaMiY4Lj7sMw8ILHdo3z-MwalimcCx80mkotSXJueeaq4ndTs4byAVj9c_42_UYgsjDGqnzNXs8EHDO6P7usr8GS3_2LJtXUX6CDTXUiUiJboNpBIhGsdG0iL2H0b0iOffGPqoznyr6ZQQYTPIL0a17X4sjcQksmblbnlU3RdBwjfuPPs47pmH_Ecw"
            />
          </div>
          <nav className="hidden md:flex items-center gap-lg">
            <a
              className="text-on-surface font-button-text text-button-text border-b border-transparent hover:border-primary transition-colors duration-300"
              href="#experiencia"
            >
              A Experiência
            </a>
            <a
              className="text-on-surface-variant font-button-text text-button-text hover:text-primary transition-colors duration-300"
              href="#como-funciona"
            >
              Metodologia
            </a>
            <a
              className="text-on-surface-variant font-button-text text-button-text hover:text-primary transition-colors duration-300"
              href="#chat"
            >
              Concierge
            </a>
            <a
              className="text-on-surface-variant font-button-text text-button-text hover:text-primary transition-colors duration-300"
              href="#faq"
            >
              Consultas
            </a>
          </nav>
          <button className="font-button-text text-button-text bg-transparent border border-primary text-primary px-lg py-sm hover:bg-primary hover:text-text-on-primary transition-all duration-300 flex items-center gap-xs">
            Private Advisory
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-section-gap px-sm md:px-lg max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-lg items-center min-h-[80vh]">
          <div className="md:col-span-7 pr-lg relative z-10">
            <h1 className="font-display-hero text-display-hero text-primary mb-md">
              Excelência na proteção do seu patrimônio.
            </h1>
            <p className="font-subheadline text-subheadline text-on-surface-variant mb-lg max-w-2xl">
              O SegurAI oferece assessoria inteligente e discreta para a gestão das suas apólices e resolução impecável de sinistros.
            </p>
            <button className="font-button-text text-button-text bg-secondary-container text-text-on-secondary px-xl py-md hover:bg-primary/90 transition-all shadow-md tracking-wider">
              Solicitar Acesso Exclusivo
            </button>
          </div>
          <div className="md:col-span-5 relative h-[600px] overflow-hidden -ml-xl md:ml-0 shadow-2xl">
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1EN9-ffazI7YqKArtNrkWnSQ3viQydt0JI5_9R3p1bVEaTayvBtqj9BGnDodeTQskRSK8mtLOeV_cn8WtnqLa3gGLRa7t_LQ9TyVZHV9e1ddSlmmACgPkWgfyNBUUQ-b9J2LNcJUpAcbWJIPo9Y2CamZHQhDMVNpPD_16L4253I795I5rfbk70KuvtiqttZKkZhAs6HPF9PKqXDZ2yufkwQiOJO-5-xIhIlS4uE2M7xUwc9-GBflqtwORCsjk4wixMgOf1LtgYZI"
              alt="Imagem Premium"
            />
          </div>
        </section>

        {/* O Problema Section */}
        <section className="bg-surface py-section-gap px-sm md:px-lg border-y border-outline-variant" id="experiencia">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-xl items-start">
              <div className="md:col-span-4">
                <h2 className="font-headline-section text-headline-section text-primary mb-md">
                  Gestão patrimonial exige precisão absoluta.
                </h2>
                <div className="w-16 h-1 bg-secondary mb-md"></div>
                <p className="font-body-main text-body-main text-on-surface-variant">
                  A complexidade dos contratos de seguro não deve ser um obstáculo para a sua tranquilidade. Desenhamos uma solução à altura das suas exigências.
                </p>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="p-lg border-l border-outline hover:border-secondary transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-sm font-light">gavel</span>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Análise Contratual</h3>
                  <p className="font-body-small text-body-small text-on-surface-variant">
                    Decodificação sofisticada de termos e cláusulas, garantindo clareza total sobre a proteção de seus ativos.
                  </p>
                </div>
                <div className="p-lg border-l border-outline hover:border-secondary transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-sm font-light">hourglass_top</span>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Resolução Ágil</h3>
                  <p className="font-body-small text-body-small text-on-surface-variant">
                    Eliminamos as esperas desnecessárias, priorizando a eficácia na resolução de qualquer eventualidade.
                  </p>
                </div>
                <div className="p-lg border-l border-outline hover:border-secondary transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-sm font-light">explore</span>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Orientação Estratégica</h3>
                  <p className="font-body-small text-body-small text-on-surface-variant">
                    Assessoria em tempo real sobre os procedimentos exatos a serem tomados para resguardar seus interesses.
                  </p>
                </div>
                <div className="p-lg border-l border-outline hover:border-secondary transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-sm font-light">admin_panel_settings</span>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Privacidade Assegurada</h3>
                  <p className="font-body-small text-body-small text-on-surface-variant">
                    Sigilo absoluto e segurança de nível bancário em todas as interações e dados analisados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* A Solução Section */}
        <section className="py-section-gap px-sm md:px-lg max-w-container-max mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-50 z-0"></div>
          <div className="relative z-10">
            <h2 className="font-headline-section text-headline-section text-primary mb-md">
              A sofisticação da simplicidade.
            </h2>
            <p className="font-subheadline text-subheadline text-on-surface-variant max-w-4xl mx-auto italic">
              "O SegurAI atua como um concierge dedicado ao seu portfólio de seguros, traduzindo a complexidade técnica em direcionamentos claros e resolutivos, 24 horas por dia."
            </p>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section className="bg-surface-container py-section-gap px-sm md:px-lg" id="como-funciona">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            <div className="relative h-full min-h-[600px] overflow-hidden shadow-xl order-2 md:order-1">
              <img
                className="absolute inset-0 w-full h-full object-cover object-center"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP5lwxUvUp69njxZQI28aAzNrZNq1hgGACoe40mFNuhgX5odqzd39yNiDJDIwOUFTWZXPCy5WANFmA_MRTQKhwwsU9wz5Wv0m9UvcjQJxK0E2xhlPjiKb9ZF4Zvz-GgigcPIWBx9jB5Y3UtGapBsTSTFFZZNxj0MW5DdGGCmwVFBFu3JO68T2NRToHxm2o9l3W-YjukXcP5CC37YXq61fF7f3cUOYk3VoHZ7-E4Wnbeg7mXTlTTKkTcojMy4FuG4nrbnoU38ZrwIY"
                alt="Mobile App"
              />
            </div>
            <div className="space-y-lg pl-0 md:pl-xl order-1 md:order-2">
              <h2 className="font-headline-section text-headline-section text-primary mb-xl">Metodologia de Atendimento</h2>
              <div className="flex gap-md items-start">
                <div className="text-secondary mt-1">
                  <span className="material-symbols-outlined text-2xl">manage_search</span>
                </div>
                <div>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Consulta Especializada</h3>
                  <p className="font-body-main text-body-main text-on-surface-variant">
                    Realize indagações sobre suas apólices e receba respostas imediatas, embasadas rigorosamente nas condições gerais do seu contrato.
                  </p>
                </div>
              </div>
              <div className="flex gap-md items-start">
                <div className="text-secondary mt-1">
                  <span className="material-symbols-outlined text-2xl">forum</span>
                </div>
                <div>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Comunicação Refinada</h3>
                  <p className="font-body-main text-body-main text-on-surface-variant">
                    Ausência de jargões desnecessários. O assistente elucida coberturas, franquias e exclusões de forma elegante e objetiva.
                  </p>
                </div>
              </div>
              <div className="flex gap-md items-start">
                <div className="text-secondary mt-1">
                  <span className="material-symbols-outlined text-2xl">switch_access_shortcut</span>
                </div>
                <div>
                  <h3 className="font-subheadline text-subheadline text-primary mb-xs">Transição Contínua</h3>
                  <p className="font-body-main text-body-main text-on-surface-variant">
                    Caso a complexidade exija, o SegurAI efetua a transição imediata para um consultor sênior, munido de todo o contexto prévio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Para Quem É Section */}
        <section className="py-section-gap px-sm md:px-lg max-w-container-max mx-auto">
          <h2 className="font-headline-section text-headline-section text-primary text-center mb-md">
            Uma solução desenhada para a excelência
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto mb-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="group">
              <div className="border-b border-outline-variant pb-md mb-md group-hover:border-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl text-tertiary group-hover:text-primary transition-colors duration-500">
                  account_balance
                </span>
              </div>
              <h3 className="font-subheadline text-subheadline text-primary mb-sm">Clientes Private</h3>
              <p className="font-body-main text-body-main text-on-surface-variant">
                Tranquilidade e discrição absolutas para compreender a proteção do seu patrimônio e acionar serviços de forma independente e sofisticada.
              </p>
            </div>
            <div className="group">
              <div className="border-b border-outline-variant pb-md mb-md group-hover:border-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl text-tertiary group-hover:text-primary transition-colors duration-500">
                  handshake
                </span>
              </div>
              <h3 className="font-subheadline text-subheadline text-primary mb-sm">Brokers Boutiques</h3>
              <p className="font-body-main text-body-main text-on-surface-variant">
                Elevação do nível de serviço com a delegação de dúvidas operacionais à inteligência artificial, permitindo foco total na consultoria estratégica.
              </p>
            </div>
            <div className="group">
              <div className="border-b border-outline-variant pb-md mb-md group-hover:border-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl text-tertiary group-hover:text-primary transition-colors duration-500">
                  assured_workload
                </span>
              </div>
              <h3 className="font-subheadline text-subheadline text-primary mb-sm">Seguradoras Premium</h3>
              <p className="font-body-main text-body-main text-on-surface-variant">
                Otimização requintada do primeiro contato, garantindo uma experiência impecável desde o primeiro instante e elevando os índices de satisfação.
              </p>
            </div>
          </div>
        </section>

        {/* Área do Chat Section */}
        <section className="bg-surface py-section-gap px-sm md:px-lg border-y border-outline-variant" id="chat">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-lg">
              <h2 className="font-headline-section text-headline-section text-primary mb-sm">Concierge Virtual</h2>
              <p className="font-body-main text-body-main text-on-surface-variant">Experimente o padrão de atendimento SegurAI.</p>
            </div>
            <div className="bg-surface-lowest shadow-2xl overflow-hidden border border-outline">
              <div className="bg-surface border-b border-outline p-md flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-sm">
                    <span className="material-symbols-outlined text-primary text-xl">memory</span>
                  </div>
                  <div>
                    <h2 className="font-button-text text-button-text text-primary">SegurAI Concierge</h2>
                    <p className="text-xs text-tertiary mt-1">Serviço Ativo</p>
                  </div>
                </div>
              </div>
              <div className="p-xl h-[450px] overflow-y-auto flex flex-col gap-lg bg-surface-background relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>

                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-sm max-w-[80%] relative z-10 ${message.role === 'user' ? 'ml-auto' : ''}`}>
                    <div
                      className={`p-md shadow-sm ${
                        message.role === 'user'
                          ? 'bg-surface-chat-user text-text-on-secondary'
                          : 'bg-surface border border-outline text-on-surface'
                      }`}
                    >
                      <p className="font-body-main text-body-main">{message.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-sm max-w-[80%] relative z-10">
                    <div className="bg-surface border border-outline p-md shadow-sm text-on-surface">
                      <p className="font-body-main text-body-main animate-pulse">Processando...</p>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="p-md border-t border-outline bg-surface">
                <div className="flex gap-sm items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border-b border-outline hover:border-primary focus:ring-0 focus:border-primary bg-transparent font-body-main text-body-main px-0 py-sm transition-colors rounded-none focus:outline-none"
                    placeholder="Insira sua solicitação..."
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="text-primary p-sm hover:text-secondary transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
                  </button>
                </div>
                <p className="font-body-small text-[12px] text-tertiary text-center mt-md">
                  Respostas embasadas exclusivamente nas condições gerais da sua apólice vigente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-section-gap px-sm md:px-lg max-w-container-max mx-auto" id="faq">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
            <div className="md:col-span-4">
              <h2 className="font-headline-section text-headline-section text-primary mb-md">Consultas Frequentes</h2>
              <div className="w-16 h-1 bg-secondary mb-md"></div>
              <p className="font-body-main text-body-main text-on-surface-variant">
                Esclarecimentos pertinentes sobre a nossa metodologia de assessoria e confidencialidade.
              </p>
            </div>
            <div className="md:col-span-8 space-y-md">
              <div className="border-b border-outline pb-sm">
                <button className="w-full flex justify-between items-center text-left py-sm group">
                  <span className="font-subheadline text-[20px] text-primary">A atuação do SegurAI substitui o corretor boutique?</span>
                  <span className="material-symbols-outlined text-tertiary group-hover:text-secondary transition-colors">add</span>
                </button>
                <div className="font-body-main text-body-main text-on-surface-variant pt-xs pb-md hidden">
                  De forma alguma. O SegurAI atua como um braço operacional de excelência para consultas ágeis e análises técnicas contratuais. Seu corretor de confiança permanece indispensável para o desenho estratégico do portfólio e negociações complexas de mercado.
                </div>
              </div>
              <div className="border-b border-outline pb-sm">
                <button className="w-full flex justify-between items-center text-left py-sm group">
                  <span className="font-subheadline text-[20px] text-primary">As orientações fornecidas possuem respaldo jurídico?</span>
                  <span className="material-symbols-outlined text-tertiary group-hover:text-secondary transition-colors">add</span>
                </button>
                <div className="font-body-main text-body-main text-on-surface-variant pt-xs pb-md hidden">
                  O concierge direciona as análises com base estrita nas Condições Gerais parametrizadas. Contudo, a validação definitiva e a regulação de coberturas são prerrogativas exclusivas da companhia seguradora mediante a análise formal do sinistro.
                </div>
              </div>
              <div className="border-b border-outline pb-sm">
                <button className="w-full flex justify-between items-center text-left py-sm group">
                  <span className="font-subheadline text-[20px] text-primary">Como é assegurada a transição para um consultor sênior?</span>
                  <span className="material-symbols-outlined text-tertiary group-hover:text-secondary transition-colors">add</span>
                </button>
                <div className="font-body-main text-body-main text-on-surface-variant pt-xs pb-md hidden">
                  O sistema monitora a complexidade da interação. A qualquer momento, ou via solicitação direta ("consultoria humana"), a sessão é transferida de imediato, garantindo que o especialista assuma o atendimento com acesso integral ao histórico da demanda.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary full-width border-t-4 border-secondary">
        <div className="flex flex-col justify-center items-center w-full px-sm md:px-lg py-xl max-w-container-max mx-auto gap-lg">
          <div className="flex items-center justify-center">
            <img
              alt="SegurAI Logo Branco"
              className="h-16 w-auto brightness-0 invert opacity-90"
              src="https://lh3.googleusercontent.com/aida/ADBb0uil7Z6ZPJKGcZq5oJIZzE0ezKhpFwm-5-nFlkcH9oPztTqIuOINAlHTM1jfY8elvtwIYcDznfHiwXf9ycx9HaMiY4Lj7sMw8ILHdo3z-MwalimcCx80mkotSXJueeaq4ndTs4byAVj9c_42_UYgsjDGqnzNXs8EHDO6P7usr8GS3_2LJtXUX6CDTXUiUiJboNpBIhGsdG0iL2H0b0iOffGPqoznyr6ZQQYTPIL0a17X4sjcQksmblbnlU3RdBwjfuPPs47pmH_Ecw"
            />
          </div>
          <div className="flex flex-wrap gap-md justify-center font-button-text text-button-text">
            <a className="text-on-primary/70 hover:text-on-primary transition-colors tracking-widest text-[11px]" href="#">
              Termos e Condições
            </a>
            <a className="text-on-primary/70 hover:text-on-primary transition-colors tracking-widest text-[11px]" href="#">
              Política de Privacidade
            </a>
            <a className="text-on-primary/70 hover:text-on-primary transition-colors tracking-widest text-[11px]" href="#">
              Segurança Patrimonial de Dados
            </a>
            <a className="text-on-primary/70 hover:text-on-primary transition-colors tracking-widest text-[11px]" href="#">
              Compliance Susep
            </a>
          </div>
          <div className="w-24 h-px bg-on-primary/20 my-sm"></div>
          <p className="font-body-small text-[12px] text-on-primary/50 text-center uppercase tracking-widest">
            © 2026 SegurAI. Tecnologia de precisão em seguros.
          </p>
        </div>
      </footer>
    </div>
  );
}
