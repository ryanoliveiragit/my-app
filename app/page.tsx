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
  Info,
  Check,
  LucideIcon
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
  icon: LucideIcon;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="border-b bg-card/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Wrench className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Blackouts Mecânica
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Calculadora de Serviços</p>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-bold">Aviso Importante</AlertTitle>
            <AlertDescription className="text-sm">
              É PROIBIDO A REVENDA DE KIT VIDROS. Compras devem ser feitas diretamente na bancada pública.
            </AlertDescription>
          </Alert>

          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-sm font-medium">
              É permitido pedir gorjetas e dar descontos esporadicamente. Os valores da tabela não podem ser alterados.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Serviços Disponíveis</CardTitle>
                    <CardDescription className="mt-1">
                      Clique em um item para adicionar ao orçamento
                    </CardDescription>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold">
                    {services.length} serviços
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const inCart = cart.find(item => item.id === service.id);

                    return (
                      <button
                        key={service.id}
                        className="group relative h-auto w-full text-left p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                        onClick={() => addToCart(service)}
                      >
                        <div className="flex w-full items-start gap-3">
                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                            {inCart && (
                              <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                                {service.name}
                              </p>
                              {inCart && (
                                <Badge variant="secondary" className="shrink-0 h-5 px-2 text-xs font-bold">
                                  {inCart.quantity}x
                                </Badge>
                              )}
                            </div>
                            <Badge variant={getCategoryVariant(service.category)} className="text-xs mb-2">
                              {service.category}
                            </Badge>
                            <p className="text-base font-bold text-primary">
                              R$ {service.price.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  Atendimentos Externos
                </CardTitle>
                <CardDescription>
                  Valores adicionais para chamados fora da oficina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="group flex items-center justify-between rounded-lg border border-border/50 bg-accent/30 p-3.5 hover:border-primary/30 hover:bg-accent/50 transition-all">
                  <span className="text-sm font-semibold">Chamado Externo</span>
                  <span className="font-bold text-primary">R$ 1.500 + serviços</span>
                </div>
                <div className="group flex items-center justify-between rounded-lg border border-border/50 bg-accent/30 p-3.5 hover:border-primary/30 hover:bg-accent/50 transition-all">
                  <span className="text-sm font-semibold">Veículos Explodidos/Naufragados</span>
                  <span className="font-bold text-primary">R$ 1.500 + serviços</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    O valor pode variar conforme a distância do chamado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border/50 shadow-xl">
              <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                    <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Orçamento
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {cart.length} {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}
                  </span>
                  {cart.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Ativo
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                      <div className="relative rounded-full bg-gradient-to-br from-muted to-muted/50 p-6">
                        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Nenhum item selecionado
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Adicione serviços ao orçamento
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                      {cart.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.id}
                            className="group rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:shadow-md p-3 space-y-3 transition-all"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-tight truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  R$ {item.price.toLocaleString('pt-BR')} / unid
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="flex items-center justify-center min-w-[2.5rem] h-7 px-2 rounded-md bg-primary/10 border border-primary/20">
                                  <span className="text-sm font-bold text-primary tabular-nums">
                                    {item.quantity}
                                  </span>
                                </div>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-base font-bold text-primary tabular-nums">
                                  R$ {(item.price * item.quantity).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Subtotal</span>
                        <span className="font-semibold tabular-nums">
                          R$ {calculateTotal().toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-0.5">Total do Orçamento</p>
                          <p className="text-2xl font-bold text-primary tabular-nums">
                            R$ {calculateTotal().toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
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