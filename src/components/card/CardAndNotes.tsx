import React, {ReactNode} from 'react';

interface CardAndNotesProps {
  card: ReactNode;
  notes: ReactNode;
}

export const CardAndNotes: React.FC<CardAndNotesProps> = ({card, notes}) => {
  return (
    <div className="card-and-notes">
      {card}
      <div className="notes">{notes}</div>
    </div>
  )
};
