import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import './Slot.scss';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';
import { Slot } from '../../../models/slot.model';
import {
  addExtra,
  setSlotAmount,
  setSlotExtra,
  setSlotName,
  deleteSlot,
} from '../../../reducers/Slots/Slots';
import { PurchaseDragType } from '../../../models/purchase';
import { DragTypeEnum } from '../../../enums/dragType.enum';

const SlotComponent: React.FC<Slot> = ({ id, extra, amount, name }: Slot) => {
  const dispatch = useDispatch();
  const [currentAmount, setCurrentAmount] = useState(amount);
  const amountInput = useRef<HTMLInputElement>(null);

  const [{ isOver, canDrop }, drops] = useDrop({
    accept: DragTypeEnum.Purchase,
    drop: ({ cost }: PurchaseDragType) =>
      dispatch(setSlotAmount({ id, amount: Number(amount) + cost })),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSlotName({ id, name: e.target.value }));
  };
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setCurrentAmount(Number(e.target.value));
  const handleExtraChange = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSlotExtra({ id, extra: Number(e.target.value) }));
  };

  const handleAddExtra = (): void => {
    dispatch(addExtra(id));
  };

  const handleDelete = (): void => {
    dispatch(deleteSlot(id));
  };

  const slotClasses = useMemo(
    () => classNames('slot', { 'drop-help': canDrop && !isOver }, { 'drag-over': isOver }),
    [canDrop, isOver],
  );

  const confirmAmount = useCallback(() => {
    dispatch(setSlotAmount({ id, amount: Number(currentAmount) }));
  }, [currentAmount, dispatch, id]);

  useEffect(() => {
    if (amountInput.current) {
      amountInput.current.onchange = confirmAmount;
    }
  }, [confirmAmount]);

  useEffect(() => setCurrentAmount(amount), [amount]);

  return (
    <div className="slot-wrapper">
      <div className={slotClasses} ref={drops}>
        <Input
          className="slot-name"
          placeholder="Название"
          onChange={handleNameChange}
          value={name}
        />
        <Input
          className="slot-money"
          placeholder="₽"
          value={currentAmount || ''}
          onChange={handleAmountChange}
          ref={amountInput}
        />
        <IconButton onClick={handleAddExtra} title="Прибавить стоимость">
          <AddIcon />
        </IconButton>
        <Input
          className="slot-money"
          placeholder="₽"
          onChange={handleExtraChange}
          value={extra || ''}
        />
      </div>
      <IconButton onClick={handleDelete} className="delete-button" title="Удалить слот">
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default SlotComponent;