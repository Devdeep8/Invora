"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ChevronRight, CheckCircle, ArrowRight, Star, BarChart, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [email, setEmail] = useState("")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isNavVisible, setIsNavVisible] = useState(false)
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  
  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  
  // Counter animation values
  const [counters, setCounters] = useState({
    customers: 0,
    invoices: 0,
    savings: 0
  })
  
  const testimonials = [
    {
      quote: "Invora has transformed our invoicing process. It's easy to use, and now I can focus more on growing my business!",
      author: "John Doe",
      position: "CEO at TechCo",
      rating: 5
    },
    {
      quote: "The payment tracking feature is a game-changer. I know exactly when to follow up with clients for overdue invoices!",
      author: "Sarah Smith",
      position: "Founder at DesignPro",
      rating: 5
    },
    {
      quote: "We've reduced our accounting overhead by 35% since switching to Invora. The automation is incredible!",
      author: "Michael Johnson",
      position: "CFO at CreativeAgency",
      rating: 4
    }
  ]
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you for signing up! We will send updates to ${email}`)
  }
  
  // Scroll event listener for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsNavVisible(true)
      } else {
        setIsNavVisible(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        customers: prev.customers < 2500 ? prev.customers + 25 : 2500,
        invoices: prev.invoices < 150000 ? prev.invoices + 1500 : 150000,
        savings: prev.savings < 35 ? prev.savings + 1 : 35
      }))
    }, 30)
    
    return () => clearInterval(interval)
  }, [])
  
  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [testimonials.length])
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white font-sans overflow-hidden">
      {/* Floating Navigation */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 shadow-md py-3"
          >
            <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-blue-800"
              >
                Invora
              </motion.div>
              <div className="flex items-center gap-6">
                <Button variant="ghost" className="text-blue-800">Features</Button>
                <Button variant="ghost" className="text-blue-800">Pricing</Button>
                <Button variant="ghost" className="text-blue-800">Testimonials</Button>
                <Button onClick={(e) => window.location.href="/login"} className="bg-blue-800 hover:bg-blue-900 text-white">Get Started</Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          />
        </div>
        
        {/* Hero content */}
        <motion.div 
          style={{ y: heroY }}
          className="max-w-screen-lg mx-auto text-center px-6 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-blue-600/50 text-white hover:bg-blue-600/70 px-4 py-1.5 text-sm">
              Simplify Your Invoicing Process
            </Badge>
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">Invora: Invoice Management</span>
              <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Made Easy for Service-Based Companies
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Automate your invoicing, track payments, and focus on what matters. 
              Invora simplifies invoice management for your business.
            </motion.p>
          </motion.div>
          
          <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="p-3 rounded-md w-full sm:w-80 text-gray-800 shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
      <Button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out"
      >
        Get Started <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.form>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="Invora Dashboard Preview"
              className="rounded-lg shadow-2xl border border-blue-700/20 mx-auto transform hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-4xl font-bold text-blue-800 mb-2">{counters.customers.toLocaleString()}+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-4xl font-bold text-blue-800 mb-2">{counters.invoices.toLocaleString()}+</h3>
              <p className="text-gray-600">Invoices Generated</p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-4xl font-bold text-blue-800 mb-2">{counters.savings}%</h3>
              <p className="text-gray-600">Average Time Saved</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">Features</Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Invora?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make invoice management effortless and efficient.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="mb-5 bg-blue-100 text-blue-800 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors duration-300">
                    <CreditCard className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Automated Invoicing</h3>
                  <p className="text-gray-600">
                    Generate and send invoices automatically with customized templates and due dates. Save time and reduce errors.
                  </p>
                  <motion.div 
                    className="mt-4 flex items-center text-blue-700 font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="mb-5 bg-green-100 text-green-800 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-green-800 group-hover:text-white transition-colors duration-300">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Payment Tracking</h3>
                  <p className="text-gray-600">
                    Track paid, pending, and overdue invoices in real-time for better cash flow management and client follow-ups.
                  </p>
                  <motion.div 
                    className="mt-4 flex items-center text-green-700 font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="mb-5 bg-purple-100 text-purple-800 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-purple-800 group-hover:text-white transition-colors duration-300">
                    <BarChart className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Analytics and Reporting</h3>
                  <p className="text-gray-600">
                    Get detailed reports on your earnings, outstanding invoices, and financial health with visual dashboards.
                  </p>
                  <motion.div 
                    className="mt-4 flex items-center text-purple-700 font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don:&apos;t just take our word for it. Here:&apos;s what our customers have to say about Invora.
            </p>
          </motion.div>
          
          <div className="relative overflow-hidden">
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 shadow-xl rounded-2xl max-w-2xl"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xl text-gray-700 mb-6 italic">{testimonials[activeTestimonial].quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold mr-4">
                      {testimonials[activeTestimonial].author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</p>
                      <p className="text-gray-600">{testimonials[activeTestimonial].position}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === activeTestimonial ? 'bg-blue-800' : 'bg-blue-200'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Pricing Plans</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business needs. All plans include a 14-day free trial.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Basic Plan</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$19</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>50 Invoices/Month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Email Support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Basic Templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Payment Tracking</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
              <Card className="h-full border-2 border-blue-600 shadow-xl overflow-hidden">
                <CardContent className="p-8 pt-12">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Pro Plan</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>200 Invoices/Month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Advanced Templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Detailed Analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Client Portal</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <Card className="h-full border-none shadow-lg overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Enterprise Plan</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Unlimited Invoices</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Dedicated Account Manager</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Custom Integrations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Advanced Analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>White Labeling</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          />
        </div>
        
        <div className="max-w-screen-lg mx-auto text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
           
            <h2 className="text-4xl font-bold mb-4">Start Managing Your Invoices Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Invora. Get started with a free trial today!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-md shadow-lg text-lg">
                Start Your Free Trial
              </Button>
            </motion.div>
          </motion.div>
        </div>
        </section>
      
      
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Invora</h3>
              <p className="text-gray-400">
                Simplifying invoice management for service-based businesses worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Features</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Pricing</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Testimonials</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">FAQ</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">About Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Careers</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Blog</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Contact</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Privacy Policy</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Terms of Service</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Cookie Policy</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Invora. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
