import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white rounded-lg p-6 space-y-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-600">
                Public Spending World is committed to protecting your privacy
                and ensuring transparency in how we handle data. This Privacy
                Policy explains how we collect, use, and safeguard your
                information when you visit our website. We strive to use only
                the minimum amount of data necessary to provide you with the
                best possible experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We collect anonymous usage data through Vercel Analytics and
                  basic system information to improve our service:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Pages visited and time spent on pages</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referral source</li>
                  <li>
                    General geographic location (country/region level only)
                  </li>
                  <li>Website performance metrics</li>
                  <li>Device type and screen size</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600">
                The information we collect is used solely to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                <li>
                  Analyze website usage patterns to improve user experience
                </li>
                <li>Identify and fix technical issues</li>
                <li>Optimize website performance</li>
                <li>Generate anonymous analytics reports</li>
                <li>Make data-driven decisions about feature improvements</li>
                <li>Monitor and prevent security issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Storage and Security
              </h2>
              <p className="text-gray-600">
                We take data security seriously. All usage data is stored
                securely and anonymously through our trusted service providers.
                We implement industry-standard security measures to protect
                against unauthorized access, alteration, disclosure, or
                destruction of data. We do not collect or store any personally
                identifiable information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-gray-600">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                <li>GitHub (for source code hosting)</li>
                <li>
                  Vercel (for website hosting and analytics)
                  <ul className="list-circle pl-6 mt-2">
                    <li>
                      Vercel Analytics collects anonymous usage data to help us
                      understand website performance and user behavior
                    </li>
                    <li>
                      This data is processed in accordance with Vercel's privacy
                      policy
                    </li>
                    <li>
                      No personally identifiable information is collected
                      through this service
                    </li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Rights and Choices
              </h2>
              <p className="text-gray-600">
                While we collect only anonymous data, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                <li>Use browser settings to control cookies and tracking</li>
                <li>Request information about the anonymous data we collect</li>
                <li>Contact us with privacy-related concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time to reflect
                changes in our practices or for operational, legal, or
                regulatory reasons. We will notify users of any material changes
                by posting the new privacy policy on this page and updating the
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us through our{" "}
                <a
                  href="https://github.com/samuelcorsan/publicspending.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  GitHub repository
                </a>
                . We aim to respond to all legitimate inquiries in a timely
                manner.
              </p>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Last updated: 5th May 2025
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
