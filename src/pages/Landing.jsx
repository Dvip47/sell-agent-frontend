/**
 * Landing Page - AWSMD Inspired
 * 
 * Purpose:
 * - Sell authority, not features
 * - Filter unserious users
 * - Push serious businesses to register/login
 */
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Zap, Users } from 'lucide-react';
import './Landing.css';
import AntiGravityCursor from '../components/ui/AntiGravityCursor';
import './Landing.css';
import ReactiveParticles from '../components/ui/ReactiveParticles';
 
export default function Landing() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const [mouseState, setMouseState] = useState({ isHovered: false, text: '' });

    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target;
            const interactive = target.closest('a') || target.closest('button') || target.closest('.clickable');

            if (interactive) {
                const hoverText = interactive.getAttribute('data-cursor-text') || 'Explore';
                setMouseState({ isHovered: true, text: hoverText });
            } else {
                setMouseState({ isHovered: false, text: '' });
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        return () => window.removeEventListener('mouseover', handleMouseOver);
    }, []);

    return (
        <div className="awsmd-landing" style={{ cursor: 'none' }}>
            <ReactiveParticles />
            {/* AntiGravity Custom Cursor */}
            <AntiGravityCursor isHovered={mouseState.isHovered} text={mouseState.text} />

            {/* Nav */}
            <nav className="awsmd-nav">
                <div className="awsmd-logo">SellAgent</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href="/login" className="awsmd-btn" data-cursor-text="Login">Sign In</a>
                    <a href="/register" className="awsmd-btn awsmd-btn-primary" data-cursor-text="Go">Deploy <ArrowRight size={16} /></a>
                </div>
            </nav>

            {/* Hero */}
            <section className="awsmd-hero">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="awsmd-hero-text">We don't sell software.</h1>
                    <h1 className="awsmd-hero-text" style={{ color: '#ccff00', WebkitTextStroke: '0px' }}>We Deploy Teams.</h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="awsmd-hero-sub"
                    >
                        Get an autonomous sales team that discovers, engages, and books meetings for your business while you sleep. Powered by advanced AI logic, zero dashboards needed.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{ position: 'absolute', bottom: '4rem', left: '4rem' }}
                >
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: '0.5' }}>[ SCROLL TO EXPLORE ]</div>
                </motion.div>
            </section>

            {/* Marquee */}
            <div className="marquee-container">
                <div className="marquee-content">
                    {/* Duplicate set to make continuous scroll flawless */}
                    <span>FIND LEADS</span><span>*</span>
                    <span>QUALIFY INTENT</span><span>*</span>
                    <span>BOOK MEETINGS</span><span>*</span>
                    <span>CLOSE DEALS</span><span>*</span>
                    <span>FIND LEADS</span><span>*</span>
                    <span>QUALIFY INTENT</span><span>*</span>
                    <span>BOOK MEETINGS</span><span>*</span>
                    <span>CLOSE DEALS</span><span>*</span>
                </div>
            </div>

            {/* Services */}
            <section className="awsmd-section">
                <div className="awsmd-title-sm">01 — What We Do</div>
                <div className="awsmd-grid-services">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="awsmd-service-card"
                    >
                        <Zap size={32} style={{ marginBottom: '2rem', color: '#ccff00' }} />
                        <h3>Find Leads</h3>
                        <p>We discover relevant businesses that match your ideal customer profile using data-science and intelligent scraping heuristics across the global web.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="awsmd-service-card"
                    >
                        <Activity size={32} style={{ marginBottom: '2rem', color: '#ccff00' }} />
                        <h3>Qualify Intent</h3>
                        <p>We engage prospects natively and understand their buying readiness through dynamic, context-aware conversations that feel incredibly human.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="awsmd-service-card"
                    >
                        <Users size={32} style={{ marginBottom: '2rem', color: '#ccff00' }} />
                        <h3>Book Meetings</h3>
                        <p>Qualified meetings are directly scheduled onto your calendar. You just wake up and close the deals. We handle the entire decentralized funnel.</p>
                    </motion.div>
                </div>
            </section>

            {/* Stats / Numbers */}
            <section className="awsmd-section" style={{ background: '#08080a' }}>
                <div className="awsmd-title-sm">02 — Our Scale</div>
                <h2 style={{ fontSize: '4vw', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', lineHeight: 1 }}>{`{SMART} OUTREACH`}</h2>
                <div className="awsmd-stats">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div className="awsmd-stat-num">300+</div>
                        <div style={{ marginTop: '1rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Points</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <div className="awsmd-stat-num">100K</div>
                        <div style={{ marginTop: '1rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Signals Scanned</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="awsmd-stat-num">+10</div>
                        <div style={{ marginTop: '1rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Integrations</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <div className="awsmd-stat-num">24/7</div>
                        <div style={{ marginTop: '1rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Execution</div>
                    </motion.div>
                </div>
            </section>

            {/* Portfolio / SMART DEVELOPMENT */}
            <section className="awsmd-section">
                <div className="awsmd-title-sm">03 — {`{SMART} DEVELOPMENT`}</div>
                <div className="awsmd-portfolio-grid">
                    <div className="awsmd-portfolio-item">
                        <div style={{ paddingRight: '2rem' }}>
                            <h2 style={{ fontSize: '4vw', fontWeight: 900, marginBottom: '2rem', lineHeight: 0.9, textTransform: 'uppercase' }}>No cookie-cutter solutions.</h2>
                            <p style={{ opacity: 0.7, fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                Look at our brutalist, hyper-optimized intelligence interface. We cut out all the noise so your team can focus exclusively on converting the highest-intent leads we serve. Built for speed, precision, and raw unadulterated execution.
                            </p>
                            <a href="/register" className="awsmd-btn" data-cursor-text="Watch">See Live Demo <ArrowRight size={16} /></a>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="awsmd-portfolio-img"
                            data-cursor-text="Play"
                        >
                            <video
                                src="/DemoVideo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                alt="Dashboard Demo Video"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="awsmd-section">
                <div className="awsmd-title-sm">04 — What Our Clients Say</div>
                <div className="awsmd-testimonial-grid">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="awsmd-testimonial-card">
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, opacity: 0.9 }}>"Since deploying SellAgent, we've entirely replaced our SDR team. It's booked 40 highly qualified meetings in our first 30 days without a single sick day."</p>
                        <div className="awsmd-testimonial-author">
                            <div className="avatar"></div>
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Lexie Ernst</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>VP Sales, TechFlow</div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="awsmd-testimonial-card">
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, opacity: 0.9 }}>"The contextual awareness of the email outreach is indistinguishable from my best human reps. The ROI was immediate."</p>
                        <div className="awsmd-testimonial-author">
                            <div className="avatar"></div>
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Lucas Rossi</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Founder, VectorAI</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Pricing / Philosophy */}
            < section className="awsmd-section" >
                <div className="awsmd-title-sm">05 — Perfect Alignment</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 500px' }}>
                        <h2 style={{ fontSize: '5vw', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9 }}>Pay per<br />Meeting.</h2>
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <p style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.5 }}>
                            No retainers. No dashboards. No noise. You pay ₹2,000 only for confirmed, qualified meetings sitting on your calendar.
                        </p>
                        <ul className="awsmd-list">
                            <li>B2B companies with proven offerings</li>
                            <li>Sales-driven organizations</li>
                            <li>Agencies seeking pipeline</li>
                            <li>Founders ready to scale</li>
                        </ul>
                    </div>
                </div>
            </section >

            {/* CTA */}
            < section className="awsmd-section" style={{ textAlign: 'center', padding: '15rem 2rem' }
            }>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{ fontSize: '6vw', fontWeight: 900, textTransform: 'uppercase', marginBottom: '3rem', lineHeight: 0.9 }}>Ready to build<br />pipeline?</h2>
                    <a href="/register" className="awsmd-btn awsmd-btn-primary" style={{ fontSize: '1.5rem', padding: '1.5rem 4rem' }}>
                        Request Access <ArrowRight size={24} />
                    </a>
                </motion.div>
            </section >

            {/* Footer */}
            < footer className="awsmd-footer" >
                <div>
                    <div className="awsmd-logo" style={{ marginBottom: '1rem', fontSize: '2rem' }}>SellAgent</div>
                    <div style={{ opacity: 0.5 }}>The Autonomous Revenue Engine.</div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a>
                    <a href="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Register</a>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </footer >
        </div >
    );
}
