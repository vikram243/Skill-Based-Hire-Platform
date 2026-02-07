import React from 'react';
import { Award, ShieldCheck, Heart, Zap, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function GuaranteePage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background">
            <main className="py-24">
                <div className="container max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12"
                    >
                        <div className="flex flex-col items-center text-center mb-16">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl mb-8"
                            >
                                <Award className="w-12 h-12" />
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">The SkillHub <span className="text-blue-600">Guarantee</span></h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                We stand behind every job booked on our platform. Your satisfaction and peace of mind are our priority.
                            </p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none space-y-16">
                            <section className="grid md:grid-cols-2 gap-12 not-prose">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold leading-tight">Peace of mind for every booking.</h2>
                                    <p className="text-lg text-muted-foreground">
                                        When you hire a pro on SkillHub, you're protected. If something goes wrong with a job booked through our platform, we're here to help.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Up to ₹50,000 property damage protection.",
                                            "Dedicated dispute resolution team.",
                                            "Re-booking support if a pro cancels last minute.",
                                            "Satisfaction guarantee on service quality."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 items-start">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-600/10 rounded-[40px] blur-3xl" />
                                    <Card className="relative p-8 border-none bg-white dark:bg-slate-900 shadow-2xl rounded-[40px] border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <ShieldCheck className="w-32 h-32" />
                                        </div>
                                        <Star className="w-10 h-10 text-yellow-500 fill-current mb-6" />
                                        <h4 className="text-2xl font-bold mb-4">"Absolutely trusted"</h4>
                                        <p className="text-muted-foreground italic mb-6 leading-relaxed">
                                            "I was worried about hiring someone online, but the SkillHub Guarantee gave me the confidence to book. The work was great, and I felt safe knowing they had my back."
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-200" />
                                            <div>
                                                <p className="font-bold">Ananya R.</p>
                                                <p className="text-xs text-muted-foreground">Verified Customer</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </section>

                            <section className="py-16 border-y border-slate-100 dark:border-slate-800">
                                <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
                                <div className="grid md:grid-cols-3 gap-8 not-prose">
                                    {[
                                        { icon: <Zap />, title: "Book on SkillHub", desc: "Always book and pay through the SkillHub app to qualify for protection." },
                                        { icon: <Heart />, title: "Stay Protected", desc: "You're automatically covered for property damage and service issues." },
                                        { icon: <Award />, title: "Resolution", desc: "If issues arise, our team works with you and the pro to find a solution." }
                                    ].map((step, i) => (
                                        <div key={i} className="text-center space-y-4">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mx-auto">
                                                {step.icon}
                                            </div>
                                            <h4 className="font-bold text-lg">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="text-center pt-8">
                                <h2 className="text-2xl font-bold mb-6">Have more questions?</h2>
                                <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                                    Our trust and safety team is available 24/7 to answer any questions you have about the SkillHub Guarantee.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center not-prose">
                                    <Button size="lg" onClick ={()=> navigate('/terms')} className="h-14 px-10 rounded-2xl bg-blue-600 font-bold">
                                        Read Full Terms
                                    </Button>
                                    <Button size="lg" onClick ={()=> navigate('/help')} variant="outline" className="h-14 px-10 rounded-2xl border-2 font-bold">
                                        Contact Support
                                    </Button>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}