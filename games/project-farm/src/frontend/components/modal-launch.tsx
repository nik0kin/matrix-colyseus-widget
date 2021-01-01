import React, { FC, ReactElement, Fragment, useState } from 'react';
import ReactModal from 'react-modal';

interface Props {
  children: (openModal: () => void) => ReactElement;
  Modal: FC<{ closeModal?: () => void }>;
}

export const ModalLaunch: FC<Props> = ({ children, Modal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <Fragment>
      {children(openModal)}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{ overlay: { zIndex: 2 } }}
      >
        <Modal closeModal={closeModal} />
      </ReactModal>
    </Fragment>
  );
};
