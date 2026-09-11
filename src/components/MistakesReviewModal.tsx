import React from 'react';
import { ReviewView, ReviewViewProps } from './ReviewView';

export interface MistakesReviewModalProps extends ReviewViewProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = (props) => {
  return <ReviewView {...props} />;
};

export { ReviewView };
