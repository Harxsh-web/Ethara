import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wrench, Menu, X, ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"

// Sample images (replace with your actual image imports or URLs)
const closetImage = "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=250&fit=crop"
const staircaseImage = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=250&fit=crop"
const doorwayImage = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=250&fit=crop"
const wallpaperImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop"

const navLinks = [
  {
    name: "Interior",
    path: "/interior",
    megaMenu: {
      left: {
        title: "Find a pro",
        links: [
          "Appliance Repair",
          "Carpet Cleaning",
          "Contractors",
          "Drywall",
          "Electrical",
          "Flooring",
          "HVAC",
          "House Cleaning",
          "Interior Painting",
          "Plumbing",
          "Remodeling",
          { name: "View all", highlight: true }
        ]
      },
      right: {
        title: "Research & plan",
        articles: [
          {
            image: closetImage,
            title: "How Much Does a Closet Remodel Cost?",
            description: "A newly remodeled, bright walk-in closet with white cabinets, built-in shelving, hanging clothes, and a window"
          },
          {
            image: staircaseImage,
            title: "How Much Does It Cost to Build or Replace a Staircase?",
            description: "A farmhouse-style staircase with a patterned runner, a black spindle railing, and a gallery wall."
          },
          {
            image: doorwayImage,
            title: "How Much Does Widening a Doorway Cost?",
            description: "A carpenter attaching the trim to a doorway"
          },
          {
            image: wallpaperImage,
            title: "How Much Does Wallpaper Removal Cost?",
            description: "The interior of a loft with a floral wallpaper"
          }
        ],
        viewAllLink: "/interior/research/all"
      }
    }
  },
  {
    name: "Exterior",
    path: "/exterior",
    megaMenu: {
      left: {
        title: "Find a pro",
        links: [
          "Concrete Repair",
          "Doors",
          "Driveways",
          "Exterior Painting",
          "Garage Doors",
          "Gutter Cleaning",
          "Gutter Repair",
          "Home Builders",
          "Masonry",
          "Roofing",
          "Siding",
          "Windows",
          { name: "View all", highlight: true }
        ]
      },
      right: {
        title: "Research & plan",
        articles: [
          {
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
            title: "How Much Does It Cost to Install Exterior Trim?",
            description: "Professional exterior trim installation on a modern house"
          },
          {
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
            title: "How Much Does Ipe Wood Decking Cost?",
            description: "Couple sitting on a deck by fire pit drinking wine"
          },
          {
            image: "https://images.unsplash.com/photo-1623298317883-6b70254edf31?w=400&h=250&fit=crop",
            title: "How Much Does a Dog Fence Cost to Install?",
            description: "A well-maintained backyard with a bright green lawn and a tall, wooden privacy fence."
          },
          {
            image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&h=250&fit=crop",
            title: "How Much Does It Cost to Pressure Wash a House?",
            description: "A professional pressure washes the exterior siding and windows of a house"
          }
        ],
        viewAllLink: "/exterior/research/all"
      }
    }
  },
  {
    name: "Lawn & Garden",
    path: "/lawn-garden",
    megaMenu: {
      left: {
        title: "Find a pro",
        links: [
          "Decks",
          "Fencing",
          "Land Surveying",
          "Landscaping",
          "Lawn & Yard Work",
          "Leaf Removal",
          "Patios",
          "Pool Installation",
          "Sprinkler Systems",
          "Sunrooms",
          "Tree Service",
          { name: "View all", highlight: true }
        ]
      },
      right: {
        title: "Research & plan",
        articles: [
          {
            image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=250&fit=crop",
            title: "How Much Does Interlocking Paver Installation Cost?",
            description: "Paver patio with cushioned chairs and a coffee table arranged in a circular layout"
          },
          {
            image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&h=250&fit=crop",
            title: "How Much Does a Land Survey Cost?",
            description: "A male land surveyor in a high-visibility vest uses a theodolite on a tripod"
          },
          {
            image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=250&fit=crop",
            title: "How Much Does Flowerbed Installation Cost?",
            description: "A colorful backyard flower garden with shrubbery"
          },
          {
            image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=400&h=250&fit=crop",
            title: "How Much Does Site Preparation Cost?",
            description: "Close up of a backhoe digging a trench"
          }
        ],
        viewAllLink: "/lawn-garden/research/all"
      }
    }
  },
  {
    name: "Guides",
    path: "/guides",
    megaMenu: {
      left: {
        title: "Find a pro",
        links: [
          "Basement Waterproofing",
          "Handymen",
          "Junk Hauling",
          "Locksmiths",
          "Moving Companies",
          "Pest Control",
          "Pressure Washing",
          "Septic Tanks",
          { name: "View all", highlight: true }
        ]
      },
      right: {
        title: "Research & plan",
        articles: [
          {
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=250&fit=crop",
            title: "How Much Does It Cost to Remodel a House?",
            description: "A worker and a contractor discussing renovation plans"
          },
          {
            image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop",
            title: "How Much Does Well Water Treatment Systems Cost?",
            description: "A woman washing her hands with water straight from the well"
          },
          {
            image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&h=250&fit=crop",
            title: "How Much Does It Cost to Replace Weatherstripping?",
            description: "A woman weatherstripping a door"
          },
          {
            image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=400&h=250&fit=crop",
            title: "How Much Does It Cost to Rent a Dump Trailer?",
            description: "A black dump trailer"
          }
        ],
        viewAllLink: "/guides/research/all"
      }
    }
  }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null)
  const [mobileExpandedMenus, setMobileExpandedMenus] = useState<Record<number, boolean>>({})
  const megaMenuRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        megaMenuRef.current &&
        event.target &&
        event.target instanceof Node &&
        !megaMenuRef.current.contains(event.target)
      ) {
        setActiveMegaMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
    setActiveMegaMenu(null)
  }

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMegaMenu(index)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveMegaMenu(null)
    }, 150)
  }

  const toggleMobileMenu = (index: number) => {
    setMobileExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <header 
      className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50" 
          : "bg-white/80 backdrop-blur-md border-b border-transparent"
        }
      `}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <NavLink 
          to="/" 
          className="group flex items-center gap-2.5 rounded-lg p-1 -ml-1"
        >
          <div className="relative">
            <Wrench className="h-7 w-7 text-white transition-transform sm:h-8 sm:w-8 bg-primary p-1 rounded-full" />
          </div>
          <span className="text-xl font-bold sm:text-2xl">
            <span className="text-gray-900">KISAN</span>
            <span className="text-primary">APP</span>
          </span>
        </NavLink>

        {/* Desktop Navigation with Mega Menu */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link, index) => (
            <div
              key={link.path}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) => `
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1
                  ${isActive || activeMegaMenu === index
                    ? "text-primary" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeMegaMenu === index ? 'rotate-180' : ''}`} />
                    {(isActive || activeMegaMenu === index) && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute inset-0 bg-primary/5 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeMegaMenu === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[900px] bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50"
                    ref={megaMenuRef}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {/* Left Column - Find a pro */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                          {link.megaMenu.left.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-1">
                          {link.megaMenu.left.links.map((item) => {
                            if (typeof item === 'string') {
                              return (
                                <NavLink
                                  key={item}
                                  to={`${link.path}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  {item}
                                </NavLink>
                              )
                            } else {
                              return (
                                <NavLink
                                  key={item.name}
                                  to={`${link.path}/view-all`}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors col-span-2"
                                >
                                  {item.name}
                                </NavLink>
                              )
                            }
                          })}
                        </div>
                      </div>

                      {/* Right Column - Research & plan */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                          {link.megaMenu.right.title}
                        </h3>
                        <div className="space-y-4">
                          {link.megaMenu.right.articles.map((article, idx) => (
                            <NavLink
                              key={idx}
                              to={`${link.path}/research/${idx}`}
                              onClick={() => setActiveMegaMenu(null)}
                              className="flex gap-3 group"
                            >
                              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                  src={article.image} 
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                  {article.description}
                                </p>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                  {article.title}
                                </p>
                              </div>
                            </NavLink>
                          ))}
                          <NavLink
                            to={link.megaMenu.right.viewAllLink}
                            onClick={() => setActiveMegaMenu(null)}
                            className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 transition-colors mt-2"
                          >
                            View all
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Side Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <NavLink
            to="/become-pro"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-100/80"
          >
            Join as a Pro
          </NavLink>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate("/dashboard")}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            Log In
          </Button>

          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-10 w-10 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 hover:bg-gray-100/80 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 border-t bg-white shadow-lg lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100"
                >
                  <div className="flex items-center justify-between px-6 py-3">
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex-1 text-sm font-medium transition-colors
                        ${isActive ? "text-primary" : "text-gray-700"}
                      `}
                    >
                      {link.name}
                    </NavLink>
                    <button
                      onClick={() => toggleMobileMenu(index)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                          mobileExpandedMenus[index] ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {mobileExpandedMenus[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {/* Mobile Find a pro section */}
                        <div className="px-6 py-3">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {link.megaMenu.left.title}
                          </h4>
                          <div className="grid grid-cols-2 gap-1">
                            {link.megaMenu.left.links.map((item) => {
                              if (typeof item === 'string') {
                                return (
                                  <NavLink
                                    key={item}
                                    to={`${link.path}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    onClick={() => setIsOpen(false)}
                                    className="py-2 text-sm text-gray-600 hover:text-gray-900"
                                  >
                                    {item}
                                  </NavLink>
                                )
                              } else {
                                return (
                                  <NavLink
                                    key={item.name}
                                    to={`${link.path}/view-all`}
                                    onClick={() => setIsOpen(false)}
                                    className="py-2 text-sm text-primary font-medium col-span-2"
                                  >
                                    {item.name}
                                  </NavLink>
                                )
                              }
                            })}
                          </div>
                        </div>

                        {/* Mobile Research & plan section */}
                        <div className="px-6 py-3 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {link.megaMenu.right.title}
                          </h4>
                          <div className="space-y-3">
                            {link.megaMenu.right.articles.map((article, idx) => (
                              <NavLink
                                key={idx}
                                to={`${link.path}/research/${idx}`}
                                onClick={() => setIsOpen(false)}
                                className="flex gap-2"
                              >
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                  <img 
                                    src={article.image} 
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {article.title}
                                  </p>
                                </div>
                              </NavLink>
                            ))}
                            <NavLink
                              to={link.megaMenu.right.viewAllLink}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center text-sm text-primary font-medium"
                            >
                              View all
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </NavLink>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <NavLink
                  to="/become-pro"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Join as a Pro
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </NavLink>
              </motion.div>

              <div className="flex flex-col gap-2 px-6 py-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigate("/dashboard")}
                  className="w-full justify-center"
                >
                  Log In
                </Button>
                <Button 
                  size="default" 
                  className="w-full justify-center bg-primary hover:bg-primary/90 text-white shadow-sm"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}