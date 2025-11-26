/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */


"use client"

import { useState, useEffect, useRef } from "react"
import {
  Wrench,
  Package,
  Hammer,
  Settings,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Truck,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Info,
  Check,
  type LucideIcon,
  Percent,
  X,
  Search,
  FileText,
  Calculator,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Service {
  id: string
  name: string
  cost: number
  price: number
  icon: LucideIcon
  category: "ferramentas" | "pecas" | "servicos"
}

interface CartItem extends Service {
  quantity: number
}

interface CompletedSale {
  id: string
  timestamp: number
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  cost: number
  profit: number
}

const services: Service[] = [
  { id: "bolsa", name: "Bolsa Mecânica", cost: 15000, price: 18000, icon: Briefcase, category: "ferramentas" },
  { id: "kit", name: "Kit Reparo", cost: 225, price: 550, icon: Package, category: "ferramentas" },
  { id: "chave-inglesa", name: "Chave Inglesa", cost: 675, price: 975, icon: Settings, category: "ferramentas" },
  { id: "elevador", name: "Macaco", cost: 275, price: 975, icon: TrendingUp, category: "ferramentas" },
  { id: "guincho", name: "Guincho Portátil", cost: 5000, price: 8000, icon: Truck, category: "ferramentas" },
  { id: "kit-freio", name: "Kit Reparo de Freio", cost: 225, price: 550, icon: AlertTriangle, category: "pecas" },
  { id: "kit-vidros", name: "Vidro", cost: 500, price: 600, icon: Package, category: "pecas" },
  { id: "pe-cabra", name: "Pé de Cabra", cost: 675, price: 975, icon: Hammer, category: "ferramentas" },
  { id: "pneu", name: "Pneu", cost: 75, price: 275, icon: Package, category: "pecas" },
  { id: "reparo-peca", name: "Reparo de Peça", cost: 0, price: 150, icon: Wrench, category: "servicos" },
]

export default function BlackoutsMecanica() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<"todos" | "ferramentas" | "pecas" | "servicos">("todos")
  const [discountPercentage, setDiscountPercentage] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAlerts, setShowAlerts] = useState(true)
  
  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showFinalSummaryModal, setShowFinalSummaryModal] = useState(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Accumulated sales tracking
  const [completedSales, setCompletedSales] = useState<CompletedSale[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTimer = () => {
    setIsTimerRunning(true)
  }

  const handlePauseTimer = () => {
    setIsTimerRunning(false)
  }

  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(0)
    setCart([])
    setDiscountPercentage(0)
    setCompletedSales([])
  }

  const handleCompleteService = () => {
    if (cart.length === 0) return

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = (subtotal * discountPercentage) / 100
    const total = subtotal - discountAmount
    const totalCost = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0)
    const netProfit = total - totalCost

    const newSale: CompletedSale = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total,
      cost: totalCost,
      profit: netProfit,
    }

    setCompletedSales((prev) => [...prev, newSale])
    setShowCompleteModal(true)
  }

  const handleConfirmComplete = () => {
    setShowCompleteModal(false)
    setCart([])
    setDiscountPercentage(0)
  }

  const handleStopTimer = () => {
    setIsTimerRunning(false)
    setShowFinalSummaryModal(true)
  }

  const handleCloseFinalSummary = () => {
    setShowFinalSummaryModal(false)
    setTimerSeconds(0)
    setCart([])
    setDiscountPercentage(0)
    setCompletedSales([])
  }

  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategory === "todos" || s.category === activeCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id)
      if (existing) {
        return prev.map((item) => (item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...service, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discountPercentage) / 100
  const total = subtotal - discountAmount
  const totalCost = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0)
  const netProfit = total - totalCost

  // Calculate accumulated totals
  const accumulatedStats = completedSales.reduce(
    (acc, sale) => ({
      totalSales: acc.totalSales + 1,
      totalRevenue: acc.totalRevenue + sale.total,
      totalCost: acc.totalCost + sale.cost,
      totalProfit: acc.totalProfit + sale.profit,
      totalDiscount: acc.totalDiscount + sale.discount,
    }),
    { totalSales: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0, totalDiscount: 0 }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Background with logo blur */}
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Background"
            fill
            className="object-cover opacity-20 blur-3xl scale-110"
            priority
          />
        </div>
        
        {/* Loading content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/image.png"
                alt="Blackouts Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Blackouts Mecânica</h1>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
              <p className="text-sm text-zinc-400 font-medium">Carregando sistema...</p>
              <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black  text-white relative">
      {/* Background with logo blur */}
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/image.png"
          alt="Background"
          fill
          className="object-cover opacity-10 blur-sm scale-110"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Complete Service Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 backdrop-blur-xl">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Venda Confirmada!</h2>
                  <p className="text-sm text-zinc-400">Venda #{completedSales.length + 1} registrada com sucesso</p>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <span className="text-zinc-400">Valor Total</span>
                  <span className="text-xl font-bold">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Lucro</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">
                    R${" "}
                    {netProfit.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleConfirmComplete}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold h-12 sm:h-14 rounded-2xl shadow-lg"
              >
                Confirmar e Novo Atendimento
              </Button>
            </div>
          </div>
        )}

        {/* Final Summary Modal */}
        {showFinalSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 my-8 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20 backdrop-blur-xl">
                  <Receipt className="h-10 w-10 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Resumo do Expediente</h2>
                  <p className="text-sm text-zinc-400">Tempo total: {formatTime(timerSeconds)}</p>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Overall Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="h-4 w-4 text-purple-400" />
                    <span className="text-xs text-zinc-500 uppercase">Total de Vendas</span>
                  </div>
                  <p className="text-3xl font-bold">{accumulatedStats.totalSales}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-zinc-500 uppercase">Tempo Médio</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {accumulatedStats.totalSales > 0
                      ? formatTime(Math.floor(timerSeconds / accumulatedStats.totalSales))
                      : "00:00:00"}
                  </p>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-sm sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 uppercase font-semibold">Lucro Total</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                    R${" "}
                    {accumulatedStats.totalProfit.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Financial Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-400" />
                  Breakdown Financeiro
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                    <span className="text-sm text-zinc-400">Receita Total</span>
                    <span className="text-base sm:text-lg font-bold">
                      R${" "}
                      {accumulatedStats.totalRevenue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                    <span className="text-sm text-zinc-400">Custo Total</span>
                    <span className="text-base sm:text-lg font-bold text-red-400">
                      -R${" "}
                      {accumulatedStats.totalCost.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {accumulatedStats.totalDiscount > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                      <span className="text-sm text-zinc-400">Descontos Concedidos</span>
                      <span className="text-base sm:text-lg font-bold text-amber-400">
                        -R${" "}
                        {accumulatedStats.totalDiscount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                    <span className="text-sm text-emerald-400 font-semibold">Lucro Líquido</span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-400">
                      R${" "}
                      {accumulatedStats.totalProfit.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Sales List */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Histórico de Vendas ({completedSales.length})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {completedSales.map((sale, index) => (
                    <div key={sale.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-purple-600 text-white">Venda #{index + 1}</Badge>
                          <span className="text-xs text-zinc-500">
                            {new Date(sale.timestamp).toLocaleTimeString("pt-BR")}
                          </span>
                        </div>
                        <span className="text-base sm:text-lg font-bold whitespace-nowrap">
                          R${" "}
                          {sale.total.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">{sale.items.length} itens</span>
                        <span className="text-emerald-400 font-semibold">
                          Lucro: R${" "}
                          {sale.profit.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCloseFinalSummary}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold h-12 sm:h-14 rounded-2xl shadow-lg"
              >
                Fechar e Novo Expediente
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl shadow-2xl">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/image.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold">Blackouts Mecânica</h1>
                  <p className="text-[10px] sm:text-xs text-zinc-500">Sistema de Orçamento</p>
                </div>
              </div>
              
              {/* Timer Display with Stats */}
              <div className="flex items-center gap-2 sm:gap-3">
                {completedSales.length > 0 && (
                  <div className="hidden lg:flex items-center gap-3 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm">
                    <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <div className="text-left">
                      <p className="text-[10px] text-zinc-500">Vendas</p>
                      <p className="text-xs sm:text-sm font-bold">{completedSales.length}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  <span className="text-sm sm:text-lg font-mono font-bold">{formatTime(timerSeconds)}</span>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                    <span className="text-xs sm:text-sm font-bold">{cart.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          {/* Alerts */}
          {showAlerts && (
            <div className="grid gap-3 mb-4 sm:mb-6 md:grid-cols-2">
              <div className="flex gap-3 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm p-4">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-400 mb-1">⚠️ Aviso Importante</p>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    É PROIBIDO A REVENDA DE KIT VIDROS. Compras devem ser feitas diretamente na bancada pública.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAlerts(false)}
                  className="h-6 w-6 shrink-0 hover:bg-white/10 text-zinc-600 hover:text-zinc-400 rounded-lg"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm p-4">
                <Info className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-purple-400 mb-1">💡 Informação</p>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    É permitido pedir gorjetas e dar descontos. Os valores da tabela não podem ser alterados.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAlerts(false)}
                  className="h-6 w-6 shrink-0 hover:bg-white/10 text-zinc-600 hover:text-zinc-400 rounded-lg"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
            {/* Left Column - Services */}
            <div className="space-y-4 sm:space-y-6">
              {/* Services Card */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                        <h2 className="text-lg sm:text-xl font-bold">Catálogo de Serviços</h2>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500">Selecione os itens para criar seu orçamento</p>
                    </div>
                    <Badge className="bg-white/10 text-zinc-300 backdrop-blur-sm h-fit rounded-full px-3 py-1">
                      {filteredServices.length} {filteredServices.length === 1 ? "item" : "itens"}
                    </Badge>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4 sm:mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="Buscar serviço..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 backdrop-blur-sm text-white placeholder:text-zinc-600 h-11 rounded-2xl focus:bg-white/10 transition-all"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-white/10 rounded-xl"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="mb-4 sm:mb-6">
                    <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm p-1 rounded-2xl h-auto">
                      <TabsTrigger
                        value="todos"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm"
                      >
                        Todos
                      </TabsTrigger>
                      <TabsTrigger
                        value="ferramentas"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Ferramentas</span>
                        <span className="sm:hidden">Ferram.</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="pecas"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm"
                      >
                        Peças
                      </TabsTrigger>
                      <TabsTrigger
                        value="servicos"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm"
                      >
                        Serviços
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Services Grid */}
                  {filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm mb-4">
                        <Search className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-700" />
                      </div>
                      <p className="text-sm font-medium text-zinc-400 mb-1">Nenhum serviço encontrado</p>
                      <p className="text-xs text-zinc-600">Tente ajustar sua busca ou categoria</p>
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredServices.map((service) => {
                        const Icon = service.icon
                        const inCart = cart.find((item) => item.id === service.id)

                        return (
                          <button
                            key={service.id}
                            onClick={() => addToCart(service)}
                            className="group relative text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all active:scale-[0.97] shadow-lg"
                          >
                            {inCart && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm leading-tight mb-1">{service.name}</p>
                                {inCart && (
                                  <Badge className="h-5 px-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full">
                                    {inCart.quantity}x
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-base sm:text-lg font-bold">R$ {service.price.toLocaleString("pt-BR")}</p>
                              {service.cost > 0 && (
                                <p className="text-xs text-zinc-600">Custo: R$ {service.cost.toLocaleString("pt-BR")}</p>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </Card>

              {/* External Services */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm">
                      <Truck className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">Atendimentos Externos</h3>
                      <p className="text-xs text-zinc-500">Valores adicionais para chamados</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Chamado Externo</p>
                        <p className="text-[10px] sm:text-xs text-zinc-600">Atendimento fora da oficina</p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-purple-400 whitespace-nowrap">R$ 1.500 + serviços</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Veículos Explodidos/Naufragados</p>
                        <p className="text-[10px] sm:text-xs text-zinc-600">Condições especiais</p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-purple-400 whitespace-nowrap">R$ 1.500 + serviços</span>
                    </div>
                    <div className="flex gap-2 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                      <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        O valor pode variar conforme a distância do chamado.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Cart & Timer */}
            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:h-fit">
              {/* Timer Controls */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">Tempo de Trabalho</h3>
                      <p className="text-xs text-zinc-500">Controle de expediente</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-6 mb-6">
                    <div className="text-4xl sm:text-5xl font-mono font-bold text-purple-400">{formatTime(timerSeconds)}</div>
                  </div>

                  {completedSales.length > 0 && (
                    <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Vendas realizadas</span>
                        <span className="font-bold">{completedSales.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Lucro acumulado</span>
                        <span className="font-bold text-emerald-400">
                          R${" "}
                          {accumulatedStats.totalProfit.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {!isTimerRunning ? (
                      <Button
                        onClick={handleStartTimer}
                        className="col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white h-11 rounded-2xl shadow-lg"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {timerSeconds === 0 ? "Iniciar" : "Retomar"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePauseTimer}
                        className="col-span-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white h-11 rounded-2xl shadow-lg"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </Button>
                    )}
                    <Button
                      onClick={handleResetTimer}
                      variant="outline"
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm h-11 rounded-2xl"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {timerSeconds > 0 && (
                    <Button
                      onClick={handleStopTimer}
                      className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white h-11 rounded-2xl shadow-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Encerrar Expediente
                    </Button>
                  )}
                </div>
              </Card>

              {/* Cart */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">Orçamento</h3>
                      <p className="text-xs text-zinc-500">
                        {cart.length} {cart.length === 1 ? "item" : "itens"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm mb-4">
                        <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-700" />
                      </div>
                      <p className="text-sm font-medium text-zinc-400 mb-1">Carrinho vazio</p>
                      <p className="text-xs text-zinc-600">Adicione serviços para começar</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item) => {
                          const Icon = item.icon

                          return (
                            <div key={item.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                                  <Icon className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm leading-tight truncate">{item.name}</p>
                                  <p className="text-xs text-zinc-500 mt-1">
                                    R$ {item.price.toLocaleString("pt-BR")} / unid
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-8 w-8 shrink-0 hover:bg-white/10 text-zinc-500 hover:text-red-400 rounded-xl"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    disabled={item.quantity <= 1}
                                    className="h-8 w-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <div className="flex items-center justify-center min-w-[3rem] h-8 px-3 rounded-xl bg-white/5 backdrop-blur-sm">
                                    <span className="text-sm font-bold tabular-nums">{item.quantity}</span>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="h-8 w-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-zinc-600 mb-0.5">Subtotal</p>
                                  <p className="text-base font-bold tabular-nums">
                                    R$ {(item.price * item.quantity).toLocaleString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Discount */}
                      <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                            <Percent className="h-4 w-4 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="discount" className="text-sm font-semibold">
                              Desconto
                            </Label>
                            <p className="text-xs text-zinc-600">Opcional</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="discount"
                            type="number"
                            min="0"
                            max="100"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
                            className="bg-white/5 backdrop-blur-sm text-white h-10 rounded-xl focus:bg-white/10 transition-all"
                            placeholder="0"
                          />
                          <span className="text-sm text-zinc-500 shrink-0 font-medium">%</span>
                        </div>
                        {discountPercentage > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-xl bg-red-500/10 backdrop-blur-sm">
                            <span className="text-xs text-red-400">Desconto aplicado</span>
                            <span className="text-xs text-red-400 font-bold">
                              -R${" "}
                              {discountAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator className="my-6 bg-zinc-800" />

                      {/* Summary */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">Subtotal dos serviços</span>
                          <span className="font-bold tabular-nums">R$ {subtotal.toLocaleString("pt-BR")}</span>
                        </div>

                        {discountPercentage > 0 && (
                          <div className="flex items-center justify-between text-sm p-2 rounded-xl bg-red-500/10 backdrop-blur-sm">
                            <span className="text-red-400 text-xs">Desconto ({discountPercentage}%)</span>
                            <span className="font-bold text-red-400 tabular-nums text-sm">
                              -R${" "}
                              {discountAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}

                        <Separator className="bg-zinc-800" />

                        <div className="space-y-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-600">Custo total</span>
                            <span className="text-zinc-500 tabular-nums">R$ {totalCost.toLocaleString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-emerald-400 font-semibold">Lucro líquido</span>
                            <span className="text-emerald-400 font-bold tabular-nums">
                              R${" "}
                              {netProfit.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                          <div>
                            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Valor total</p>
                            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white">
                              R${" "}
                              {total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <FileText className="h-8 w-8 text-zinc-700" />
                        </div>

                        <Button
                          onClick={handleCompleteService}
                          disabled={!isTimerRunning}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold h-12 sm:h-14 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirmar Venda
                        </Button>
                        {!isTimerRunning && (
                          <p className="text-xs text-center text-amber-400">
                            Inicie o cronômetro para confirmar vendas
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  )
}