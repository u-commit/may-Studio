import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import Button from '@components/Button/Button';
import styles from '../styles.module.scss';
const {
  reviewSection,
  reviewHeading,
  reviewList,
  reviewItem,
  reviewStars,
  reviewForm,
  reviewIntro,
  ratingField,
  ratingStars,
  ratingStar,
  ratingSelected,
  reviewField,
  reviewSubmit,
} = styles;

function getStorageKey(productId) {
  return `may-studio-product-reviews-${productId}`;
}

function readReviews(productId) {
  try {
    const saved = JSON.parse(localStorage.getItem(getStorageKey(productId)) ?? '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState(() => readReviews(productId));
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setReviews(readReviews(productId));
    setRating(0);
  }, [productId]);

  function submitReview(event) {
    event.preventDefault();
    if (!rating) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const review = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      rating,
      content: String(formData.get('review') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      createdAt: new Date().toISOString(),
    };
    const nextReviews = [review, ...reviews];
    setReviews(nextReviews);
    try {
      localStorage.setItem(getStorageKey(productId), JSON.stringify(nextReviews));
    } catch {
      // Keep the submitted review visible for this page session if storage is unavailable.
    }
    form.reset();
    setRating(0);
  }

  return (
    <section className={reviewSection} aria-labelledby='product-reviews-title'>
      <h2 id='product-reviews-title' className={reviewHeading}>
        ĐÁNH GIÁ ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <div className={reviewList}>
          {reviews.map((review) => (
            <article className={reviewItem} key={review.id}>
              <div className={reviewStars} aria-label={`${review.rating} trên 5 sao`}>
                {Array.from({ length: review.rating }, (_, index) => (
                  <FiStar key={index} aria-hidden='true' />
                ))}
              </div>
              <p>{review.content}</p>
              <span>
                {review.name} · {new Date(review.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </article>
          ))}
        </div>
      )}

      <h3 className={reviewIntro}>
        HÃY LÀ NGƯỜI ĐẦU TIÊN ĐÁNH GIÁ “{productName}”
      </h3>
      <p>Email của bạn sẽ không được công khai. Các trường bắt buộc được đánh dấu *.</p>

      <form className={reviewForm} onSubmit={submitReview}>
        <fieldset className={ratingField}>
          <legend>Đánh giá của bạn <span>*</span></legend>
          <div className={ratingStars} role='radiogroup' aria-label='Chọn số sao' aria-required='true'>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type='button'
                role='radio'
                aria-checked={rating === value}
                aria-label={`${value} sao`}
                className={`${ratingStar} ${rating >= value ? ratingSelected : ''}`}
                onClick={() => setRating(value)}
              >
                <FiStar aria-hidden='true' />
              </button>
            ))}
          </div>
        </fieldset>

        <label className={reviewField}>
          Nhận xét của bạn <span>*</span>
          <textarea name='review' rows='6' required />
        </label>
        <label className={reviewField}>
          Họ tên <span>*</span>
          <input type='text' name='name' autoComplete='name' required />
        </label>
        <label className={reviewField}>
          Email <span>*</span>
          <input type='email' name='email' autoComplete='email' required />
        </label>
        <Button
          type='submit'
          content='GỬI ĐÁNH GIÁ'
          variant='primary'
          className={reviewSubmit}
          disabled={rating === 0}
        />
      </form>
    </section>
  );
}

export default ProductReviews;
