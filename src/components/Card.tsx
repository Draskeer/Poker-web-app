import React from 'react';
interface CardProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
  const imageUrl = process.env.PUBLIC_URL + `/PlayingCards/${title}.jpg`;

  return (
    <div className="border border-black w-[137px] h-[193px]">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </div>
  );
};



export default Card;