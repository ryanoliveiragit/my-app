"use client";

import { useState } from "react";
import { 
  Wrench, 
  Circle, 
  Hammer, 
  Settings, 
  TrendingUp, 
  Package, 
  Briefcase,
  Truck,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Service {
  id: string;
  name: string;
  price: number;
  icon: any;
  category: string;
}

interface CartItem extends Service {
  quantity: number;
}

export default function BlackoutsMecanica() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const services: Service[] = [
    { id: "kit", name: "Kit", price: 550, icon: Package, category: "ferramentas" },
    { id: "pneu", name: "Pneu", price: 275, icon: Circle, category: "peças" },
    { id: "pe-cabra", name: "Pé de Cabra", price: 975, icon: Hammer, category: "ferramentas" },
    { id: "chave-inglesa", name: "Chave Inglesa", price: 975, icon: Settings, category: "ferramentas" },
    { id: "elevador", name: "Elevador Hidráulico", price: 975, icon: TrendingUp, category: "ferramentas" },
    { id: "kit-freio", name: "Kit de Reposição de Freio", price: 550, icon: AlertTriangle, category: "peças" },
    { id: "bolsa", name: "Bolsa Mecânica", price: 18000, icon: Briefcase, category: "ferramentas" },
    { id: "guincho", name: "Guincho Portátil", price: 8000, icon: Truck, category: "ferramentas" },
    { id: "kit-vidros", name: "Kit de Vidros", price: 600, icon: Package, category: "peças" },
    { id: "reparo-peca", name: "Reparo de Peça", price: 150, icon: Wrench, category: "serviços" },
  ];

  const addToCart = (service: Service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCategoryVariant = (category: string): "default" | "secondary" | "outline" => {
    switch(category) {
      case "ferramentas": return "default";
      case "peças": return "secondary";
      case "serviços": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Blackouts Mecânica</h1>
              <p className="text-sm text-muted-foreground">Calculadora de Serviços</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-3">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso Importante</AlertTitle>
            <AlertDescription>
              É PROIBIDO A REVENDA DE KIT VIDROS. Compras devem ser feitas diretamente na bancada pública.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              É permitido pedir gorjetas e dar descontos esporadicamente. Os valores da tabela não podem ser alterados.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Disponíveis</CardTitle>
                <CardDescription>
                  Clique em um item para adicionar ao orçamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const inCart = cart.find(item => item.id === service.id);
                    
                    return (
                      <Button
                        key={service.id}
                        variant="outline"
                        className="h-auto w-full justify-start p-4 hover:bg-accent"
                        onClick={() => addToCart(service)}
                      >
                        <div className="flex w-full items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <p className="font-semibold leading-none">{service.name}</p>
                                <Badge variant={getCategoryVariant(service.category)} className="text-xs">
                                  {service.category}
                                </Badge>
                              </div>
                              {inCart && (
                                <Badge variant="secondary" className="shrink-0">
                                  {inCart.quantity}x
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-lg font-bold text-primary">
                              R$ {service.price.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Atendimentos Externos
                </CardTitle>
                <CardDescription>
                  Valores adicionais para chamados fora da oficina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">Chamado Externo</span>
                  <span className="font-semibold">R$ 1.500 + serviços</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">Veículos Explodidos/Naufragados</span>
                  <span className="font-semibold">R$ 1.500 + serviços</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  * O valor pode variar conforme a distância do chamado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Orçamento
                </CardTitle>
                <CardDescription>
                  {cart.length} {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nenhum item selecionado
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div 
                            key={item.id}
                            className="rounded-lg border p-3 space-y-3"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm leading-none truncate">{item.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  R$ {item.price.toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-semibold tabular-nums">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-bold tabular-nums">
                                R$ {(item.price * item.quantity).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold tabular-nums">
                          R$ {calculateTotal().toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold tabular-nums">
                          R$ {calculateTotal().toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setCart([])}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpar Orçamento
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}