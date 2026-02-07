import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import {
    ShieldCheck,
    Users,
    MessageSquare,
    Heart,
    ThumbsUp,
    AlertTriangle,
    Scale,
    Handshake,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommunityGuidelinesPage() {

    const navigate = useNavigate();
    const guidelines = [
        {
            icon: <Users className="w-8 h-8 text-blue-500" />,
            title: "Respect for Everyone",
            desc: "Treat all community members with dignity and respect. Discrimination, harassment, or abusive behavior of any kind will not be tolerated."
        },
        {
            icon: <Handshake className="w-8 h-8 text-purple-500" />,
            title: "Trust & Transparency",
            desc: "Be honest in your interactions. Provide accurate information on profiles, and honor all commitments made during the booking process."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            title: "Safety First",
            desc: "Prioritize the physical and emotional safety of yourself and others. Follow our safety protocols and report any suspicious activity immediately."
        },
        {
            icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
            title: "Clear Communication",
            desc: "Maintain professional communication within the platform. Clear expectations lead to better results for both providers and customers."
        },
        {
            icon: <ThumbsUp className="w-8 h-8 text-yellow-500" />,
            title: "Quality of Service",
            desc: "Providers should deliver high-quality work that matches their skill descriptions. Customers should provide constructive feedback."
        },
        {
            icon: <Scale className="w-8 h-8 text-slate-500" />,
            title: "Fair Practices",
            desc: "No price gouging, off-platform payment requests, or spamming. We aim for a fair marketplace for all participants."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <main>
                {/* Hero Section */}
                <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" />
                    <div className="container max-w-5xl mx-auto px-6 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold border border-white/20 mb-8"
                        >
                            <Heart className="w-4 h-4 fill-current text-red-500" />
                            Community First
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">Community Guidelines</h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            We're building a community based on trust, respect, and professional excellence. These guidelines help ensure a positive experience for everyone.
                        </p>
                    </div>
                </section>
                {/* Guidelines Grid */}
                <section className="py-16 px-6">
                    <div className="container max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guidelines.map((g, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="p-8 h-full hover:shadow-xl transition-all border-none bg-slate-50 dark:bg-slate-900/40 rounded-3xl group">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            {g.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{g.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{g.desc}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dos and Don'ts */}
                <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/20">
                    <div className="container max-w-5xl mx-auto">
                        <h2 className="text-3xl font-black mb-12 text-center">Dos and Don'ts</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-emerald-600">
                                    <CheckCircle2 className="w-7 h-7" />
                                    What we encourage
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Complete profiles with real photos and skills.",
                                        "Prompt responses to messages and inquiries.",
                                        "Fair and honest reviews after job completion.",
                                        "Using the SkillHub secure payment system.",
                                        "Respecting the customer's property and time."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-red-600">
                                    <XCircle className="w-7 h-7" />
                                    What we don't allow
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Requesting or offering cash payments off-platform.",
                                        "Posting fake reviews or manipulating ratings.",
                                        "Discrimination based on race, gender, or religion.",
                                        "Canceling at the last minute without a valid reason.",
                                        "Sharing private customer contact info with others."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                                                <XCircle className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reporting Section */}
                <section className="py-24 px-6">
                    <div className="container max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 rounded-3xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black mb-6">See something? Say something.</h2>
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                            Our community relies on users like you to maintain high standards. If you encounter behavior that violates these guidelines, please report it to our trust and safety team immediately.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/help')}
                                className="h-16 px-10 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors"
                            >
                                Report a Violation
                            </button>
                            <button
                                onClick={() => navigate('/safety')}
                                className="h-16 px-10 rounded-2xl border-2 border-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Learn More About Safety
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}