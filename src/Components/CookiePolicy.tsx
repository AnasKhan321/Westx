import { useEffect } from 'react';
import SEO from '../ReusableComponents/SEO';
import { motion } from "motion/react"

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[98vh]  max-h-[98vh] my-[2vh]  overflow-y-scroll bg-secondaryColor rounded-l-lg border border-white/10 text-white">
      <SEO title={"Cookie Policy"} description={"Cookie Policy for WestX"} />
      <div className="w-full mx-auto px-4 py-16">
        {/* Header */}
        <motion.div  initial={{opacity : 0 , y:-20  }} animate={{opacity : 1 , y:0  }} transition={{duration : 0.5}} className="text-center mb-12">
          <img src="https://westx.s3.us-east-1.amazonaws.com/photo_6215202682931628249_y.jpg" alt="" className='w-[150px] h-[150px] rounded-full mx-auto' />
          <p className="text-gray-400 mt-5 ">Last Updated: March 8, 2025</p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="bg-newcolor border-2 border-[#13181b] p-6 rounded-xl backdrop-blur-sm mb-8">
          <p className="leading-relaxed ">
            At WestX, we use cookies to enhance your experience on our platform.
            This Cookie Policy explains how and why we use cookies, specifically Firebase cookies,
            and how you can manage your preferences.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What Are Cookies */}
          <Section
            title="1. What Are Cookies?"
            content="Cookies are small text files stored on your device when you visit a website. They help us improve platform functionality, security, and user experience."
          />

          {/* Types of Cookies */}
          <Section
            title="2. What Cookies Do We Use?"
            content={
              <div className="space-y-4">
                <p>WestX only uses Firebase cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-3 pl-4">
                  <li className="">
                    <span className="font-semibold">Authentication & Security:</span>
                    <span className="text-gray-300"> Firebase cookies help authenticate users and maintain secure sessions.</span>
                  </li>
                  <li className="">
                    <span className="font-semibold">Performance & Analytics:</span>
                    <span className="text-gray-300"> We use Firebase cookies to track engagement and improve platform performance.</span>
                  </li>
                  <li className="">
                    <span className="font-semibold">Session Management:</span>
                    <span className="text-gray-300"> These cookies help ensure a seamless user experience by remembering login sessions.</span>
                  </li>
                </ul>
                <p className="mt-4 text-gray-300">
                  WestX does not use third-party tracking cookies, advertising cookies, or any other cookies unrelated to Firebase services.
                </p>
              </div>
            }
          />

          {/* Managing Cookies */}
          <Section
            title="3. Managing Cookies"
            content={
              <div className="space-y-4">
                <p>You can control and manage cookies in the following ways:</p>
                <ul className="list-disc list-inside space-y-3 pl-4 text-gray-300">
                  <li>
                    <span className="font-semibold">Browser Settings:</span> Most browsers allow you to delete or block cookies through their settings.
                  </li>
                  <li>
                    <span className="font-semibold">Platform Preferences:</span> You can manage session-related cookies within your WestX account settings.
                  </li>
                  <li>
                    <span className=" font-semibold">Opting Out:</span> Disabling cookies may impact certain features, such as authentication and session management.
                  </li>
                </ul>
              </div>
            }
          />

          {/* Changes to Policy */}
          <Section
            title="4. Changes to This Cookie Policy"
            content="We may update this Cookie Policy as needed. Changes will be reflected with an updated date at the top of the policy."
          />

          {/* Contact Section */}
          <div className="bg-newcolor border-2 border-[#13181b] p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="mb-4 text-gray-300">For any questions or concerns about our use of cookies, you can contact us at:</p>
            <div className="flex flex-col md:flex-row gap-4 text-purple-300">
              <a href="mailto:contact@westx.com" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                <span>📧</span> westxai@gmail.com
              </a>
              <a href="https://westx.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                <span>🌐</span> www.westx.xyz
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-800">
            <p className="mt-4 text-xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              WestX - The Future of AI Social Media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Section component
const Section = ({ title, content }: { title: string; content: string | JSX.Element }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }} className="bg-newcolor border-2 border-[#13181b] p-6 rounded-xl backdrop-blur-sm">
    <h2 className="text-2xl font-semibold mb-4 ">{title}</h2>
    {typeof content === 'string' ? (
      <p className=" leading-relaxed">{content}</p>
    ) : (
      content
    )}
  </motion.section>
);

export default CookiePolicy;
