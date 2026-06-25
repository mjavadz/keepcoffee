import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Gift, Percent } from './Icons';
import './CustomerClub.css';

export default function CustomerClub() {
  return (
    <section id="club" className="customer-club-section">
      <div className="container">
        <div className="club-content">
          <div className="club-text">
            <span className="club-badge">ویژه وفاداران</span>
            <h2>باشگاه مشتریان کیپ کافی</h2>
            <p>
              با عضویت در باشگاه مشتریان ما، از اولین خرید خود امتیاز جمع کنید و از تخفیف‌های ویژه، هدایای اختصاصی و دسترسی زودهنگام به محصولات جدید و کمیاب بهره‌مند شوید.
            </p>
            
            <div className="club-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Award size={24} />
                </div>
                <div>
                  <h4>کسب امتیاز با هر خرید</h4>
                  <p>به ازای هر ۱۰ هزار تومان، ۱ امتیاز بگیرید.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Percent size={24} />
                </div>
                <div>
                  <h4>تخفیف‌های پلکانی</h4>
                  <p>تا ۱۵٪ تخفیف دائمی با ارتقای سطح کاربری.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Gift size={24} />
                </div>
                <div>
                  <h4>هدایای روز تولد</h4>
                  <p>در روز تولدتان از ما سورپرایز ویژه دریافت کنید.</p>
                </div>
              </div>
            </div>

            <Link to="/club" className="btn btn-primary club-btn">عضویت در باشگاه</Link>
          </div>
          
          <div className="club-image-container">
            <div className="club-card">
              <div className="club-card-header">
                <h3>VIP Member</h3>
                <span>Keep Coffee</span>
              </div>
              <div className="club-card-body">
                <div className="card-chip"></div>
                <div className="card-number">**** **** **** ۸۰۹۲</div>
              </div>
              <div className="club-card-footer">
                <span>نام شما</span>
                <span>سطح طلایی</span>
              </div>
            </div>
            {/* Background decoration elements */}
            <div className="club-bg-circle circle-1"></div>
            <div className="club-bg-circle circle-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
