// FAQ.tsx
import React from 'react';
import './FAQ.css';

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1>Welcome to the Happy Capsule FAQ Page!</h1>
      <p>Here you’ll find answers to common questions about using our app.</p>

      <div className="section-title">General Questions</div>
      
      <div className="question">Q1: What is Happy Capsule?</div>
      <div className="answer">Happy Capsule is a journaling app designed to help you practice gratitude in creative and engaging ways. You can create multimedia entries (text, images, videos, and audio), track your journaling habits, and revisit past entries through time-locked capsules.</div>

      <div className="question">Q2: Who is Happy Capsule for?</div>
      <div className="answer">The app is designed for everyone!  If you're looking for an easy and fun way to improve their mental well-being, try Happy Capsule's gratitude journaling.</div>

      <div className="question">Q3: What makes Happy Capsule different from other journaling apps?</div>
      <div className="answer">Unlike traditional journaling apps, Happy Capsule allows you to:
        <ul>
          <li>Use multimedia formats like drawing and images.</li>
          <li>Time-lock entries to revisit them later as a surprise.</li>
          <li>Get insights about your journaling habits through analytics.</li>
        </ul>
      </div>

      <div className="section-title">Using the App</div>

      <div className="question">Q4: How do I create an entry?</div>
      <div className="answer">
        1. Open the app and click the “Create Entry” button.<br />
        2. Choose the format for your entry (draw, text, or image).<br />
        3. Add your gratitude moments and save your entry.
      </div>

      <div className="question">Q5: What is a time-locked capsule?</div>
      <div className="answer">A time-locked capsule is a journal entry that is hidden until a specific date or is unlocked randomly in the future. This feature allows you to reflect on your past gratitude moments in a meaningful way.</div>

      <div className="question">Q6: How do I schedule a time-locked capsule?</div>
      <div className="answer">When creating an entry, choose the “Time-Lock” option, then select a date or set it to unlock randomly in the future.</div>

      <div className="question">Q8: How can I track my journaling habits?</div>
      <div className="answer">Visit the “Analytics” tab to see your journaling frequency, the types of media you use, and other stats about your entries.</div>

      <div className="section-title">Technical Questions</div>

      <div className="question">Q9: Is the app available on mobile?</div>
      <div className="answer">Currently, Happy Capsule is designed for desktop use. Mobile optimization is planned for future updates.</div>

      <div className="question">Q10: How is my data secured?</div>
      <div className="answer">We use encryption to protect your data and ensure your multimedia entries and personal information remain private.</div>

      <div className="question">Q11: Can I export my entries?</div>
      <div className="answer">Not yet, but we’re working on adding an export feature in a future update.</div>

      <div className="section-title">Troubleshooting</div>

      <div className="question">Q12: The app isn’t working on my device. What should I do?</div>
      <div className="answer">
        - Make sure your browser is up-to-date.<br />
        - Try clearing your cache and reloading the page.<br />
        - If the issue persists, contact our support team at <a href="mailto:support@happycapsule.com" className="email">support@happycapsule.com</a>.
      </div>

      <div className="question">Q14: I can’t find my saved entry. Where is it?</div>
      <div className="answer">All saved entries are stored in the “My Capsules” section. If you don’t see it there, check your internet connection and try refreshing the page.</div>

      <div className="question">Q15: My time-locked capsule didn’t unlock. What now?</div>
      <div className="answer">Check the date you selected for unlocking. If the date has passed and it’s still locked, contact our support team for assistance.</div>

      <div className="section-title">Feedback and Support</div>

      <div className="question">Q16: How can I give feedback on the app?</div>
      <div className="answer">We’d love to hear from you! Email us at <a href="mailto:feedback@happycapsule.com" className="email">feedback@happycapsule.com</a>.</div>

      <div className="question">Q17: How do I report a bug or issue?</div>
      <div className="answer">Please report any bugs or issues by emailing <a href="mailto:bugs@happycapsule.com" className="email">bugs@happycapsule.com</a> with details about the problem.</div>

      <p>If you have any other questions, feel free to reach out to us at <a href="mailto:info@happycapsule.com" className="email">info@happycapsule.com</a>.</p>

      <p>Happy Journaling!</p>
    </div>
  );
};

export default FAQ;
