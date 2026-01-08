import { ContactForm } from "@/components/contact/contact-form";
import {
  AnimatedBackground,
  CardBackgroundDecoration,
  GradientText,
  HoverGradient,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the LinkShort team",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "support@linkshort.io",
    description: "We'll respond within 24 hours",
    color: "from-[#e6560f] to-orange-600",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am-5pm EST",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: MapPin,
    title: "Office",
    content: "123 Tech Street, SF, CA",
    description: "San Francisco, CA 94107",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Clock,
    title: "Support Hours",
    content: "24/7 Online Support",
    description: "Premium plans get priority",
    color: "from-orange-600 to-[#e6560f]",
  },
];

const inquiryTypes = [
  {
    icon: MessageSquare,
    title: "Sales Inquiries",
    description:
      "Interested in our Business or Enterprise plans? Our sales team can help you find the right solution for your needs.",
    gradient: "from-[#e6560f]/10 to-orange-500/10",
  },
  {
    icon: HelpCircle,
    title: "Technical Support",
    description:
      "Having trouble with your account or links? Check our documentation or reach out to our support team.",
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    icon: Building2,
    title: "Partnership Opportunities",
    description:
      "Want to partner with LinkShort? We're always looking for new ways to collaborate with innovative companies.",
    gradient: "from-amber-500/10 to-yellow-500/10",
  },
];

const faqs = [
  {
    q: "How quickly will I get a response?",
    a: "We typically respond to all inquiries within 24 hours during business days. Premium customers get priority support with faster response times.",
  },
  {
    q: "Can I request a demo?",
    a: "Absolutely! For Business and Enterprise plans, we offer personalized demos. Just select 'Demo Request' as your inquiry type in the contact form.",
  },
  {
    q: "Do you offer phone support?",
    a: "Phone support is available for Business and Enterprise customers. All users have access to email and chat support.",
  },
  {
    q: "Where can I find documentation?",
    a: "Our comprehensive documentation is available at docs.linkshort.io. It covers everything from getting started to advanced API usage.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section  */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <AnimatedBackground variant="hero" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 hover:bg-[#e6560f]/15 px-5 py-2 text-sm font-medium shadow-lg shadow-[#e6560f]/5">
              <Sparkles className="h-4 w-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              W&apos;d Love to <GradientText>Hear From You</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question, feedback, or need help? We&apos;d love to hear
              from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards  */}
      <section className="pb-20 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info) => (
              <Card
                key={info.title}
                className="group bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-6 text-center relative">
                  <HoverGradient />

                  <div
                    className={`h-14 w-14 rounded-2xl bg-linear-to-br ${info.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                  >
                    <info.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-[#e6560f] transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-[#e6560f] font-medium">{info.content}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section  */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-white dark:bg-zinc-950">
        <AnimatedBackground variant="section" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
                <MessageSquare className="h-4 w-4 mr-2" />
                How Can We Help?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Send Us a <GradientText>Message</GradientText>
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible. For urgent matters, please call our support line.
              </p>

              <div className="space-y-4">
                {inquiryTypes.map((type) => (
                  <Card
                    key={type.title}
                    className="group bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-linear-to-br from-[#e6560f]/10 to-orange-500/10 border border-[#e6560f]/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <type.icon className="h-5 w-5 text-[#e6560f]" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 group-hover:text-[#e6560f] transition-colors">
                            {type.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-2xl overflow-hidden relative">
              <CardBackgroundDecoration />

              <CardContent className="p-6 md:p-8 relative">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section  */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Common <GradientText>Questions</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to questions you might have.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card
                  key={faq.q}
                  className="group bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300"
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    <HoverGradient className="w-24 h-24" />

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#e6560f] transition-colors">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section  */}
      <section className="pb-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 h-100 flex items-center justify-center overflow-hidden">
                <AnimatedBackground variant="cta" gridSize="2rem" />

                <div className="relative text-center z-10">
                  <div className="h-24 w-24 rounded-full bg-linear-to-br from-[#e6560f] to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#e6560f]/30 animate-bounce">
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Visit Our Office</h3>
                  <p className="text-muted-foreground text-lg">
                    123 Tech Street, San Francisco, CA 94107
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-[#e6560f]" />
                    Open Monday - Friday, 9am - 5pm EST
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
