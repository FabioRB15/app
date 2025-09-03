import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useToast } from '../hooks/use-toast';
import { MessageCircle, Mail, Phone, Clock, Shield, Headphones, Send } from 'lucide-react';

const Support = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const testimonialsData = await apiService.getTestimonials();
      setTestimonials(testimonialsData);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Não foi possível carregar os depoimentos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (value) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await apiService.submitSupportRequest(formData);
      
      toast({
        title: "Solicitação enviada!",
        description: `Sua solicitação foi enviada com sucesso. ID: ${response.request_id}`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
      
    } catch (err) {
      console.error('Error submitting support request:', err);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section id="support" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Suporte que
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Nunca Te Abandona</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa equipe de especialistas está sempre pronta para ajudar você a conquistar seus objetivos
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Chat ao Vivo
              </CardTitle>
              <CardDescription>
                Resposta instantânea para dúvidas urgentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-700 mb-4">
                <Clock className="w-3 h-3 mr-1" />
                Online agora
              </Badge>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Email Suporte
              </CardTitle>
              <CardDescription>
                Para questões detalhadas e técnicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-blue-100 text-blue-700 mb-4">
                <Clock className="w-3 h-3 mr-1" />
                Resposta em 2h
              </Badge>
              <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                Enviar Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Suporte Premium
              </CardTitle>
              <CardDescription>
                Linha direta para clientes Archmage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-purple-100 text-purple-700 mb-4">
                <Shield className="w-3 h-3 mr-1" />
                24/7 Dedicado
              </Badge>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                Ligar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form & Support Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Fale Conosco
              </CardTitle>
              <CardDescription>
                Envie sua dúvida ou solicitação e nossa equipe retornará em breve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Descreva brevemente o assunto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva sua dúvida ou problema em detalhes..."
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="small" className="mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Support Stats & Features */}
          <div className="space-y-8">
            {/* Support Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Por que nosso suporte é diferente?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Headphones className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Especialistas em Gaming</h4>
                    <p className="text-gray-600">Nossa equipe é formada por gamers experientes que entendem suas necessidades.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Resposta Rápida</h4>
                    <p className="text-gray-600">Tempo médio de resposta de apenas 5 minutos no chat ao vivo.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Suporte Proativo</h4>
                    <p className="text-gray-600">Monitoramos seus servidores 24/7 e avisamos sobre qualquer problema.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Stats */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Números que impressionam
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98.7%</div>
                  <div className="text-sm text-gray-600">Satisfação do Cliente</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">&lt; 5min</div>
                  <div className="text-sm text-gray-600">Tempo de Resposta</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Disponibilidade</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5k+</div>
                  <div className="text-sm text-gray-600">Tickets Resolvidos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            O que nossos clientes dizem
          </h3>
          
          {isLoading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchTestimonials} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Support;