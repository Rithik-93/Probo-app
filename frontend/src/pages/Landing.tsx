import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" to="#">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-2xl font-bold text-primary">OpinionTrade</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
                        About
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
                        Contact
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Trade Opinions, Shape the Future
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Join the world's first opinion trading platform. Invest in ideas, profit from predictions, and shape
                                        the future of public discourse.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button size="lg" onClick={() => navigate('/events')}>Get Started</Button>
                                    <Button size="lg" variant="outline">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground rounded-full blur-2xl opacity-20"></div>
                                    <BarChart3 className="w-full h-full text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <TrendingUp className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Real-time Trading</h2>
                                <p className="text-muted-foreground">
                                    Experience lightning-fast opinion trading with our cutting-edge platform.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Users className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Community Insights</h2>
                                <p className="text-muted-foreground">
                                    Gain valuable insights from a diverse community of thought leaders and analysts.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Zap className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Predictive Analytics</h2>
                                <p className="text-muted-foreground">
                                    Leverage advanced AI to make informed decisions and stay ahead of the curve.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join the Opinion Economy</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Start trading opinions today and become part of the future of idea exchange. Sign up now to get early
                                    access and exclusive benefits.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex space-x-2">
                                    <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                                    <Button type="submit">Sign Up</Button>
                                </form>
                                <p className="text-xs text-muted-foreground">
                                    By signing up, you agree to our{" "}
                                    <Link className="underline underline-offset-2" to="#">
                                        Terms & Conditions
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">© 2024 OpinionTrade. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" to="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" to="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}

