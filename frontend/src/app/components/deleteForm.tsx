import React from 'react';
import styles from '../user/admin/styles/admin.module.scss';

interface DeleteConfirmationModalProps {
  showModal: boolean;
  productId: number | null;
  onConfirmDelete: (productId: number) => void;
  onCancelDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ showModal, productId, onConfirmDelete, onCancelDelete }) => {
  if (!showModal || productId === null) return null; 
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4>Вы точно хотите удалить этот товар?</h4>
        <button onClick={() => onConfirmDelete(productId)}>Да</button>
        <button onClick={onCancelDelete}>Отмена</button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
