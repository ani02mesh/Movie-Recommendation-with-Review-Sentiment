import React from "react";
import { useSelector } from "react-redux";
import HorizontalCard from "../components/HorizontalCard";

const Home = () => {
  const cardDatas = useSelector((state) => state.cineData.cardData);

  if (cardDatas.length !== 0) {
    return (
      <div>
        <HorizontalCard
          data={cardDatas.df1}
          heading={"Top Rated Movies"}
          flash={true}
        />
        <HorizontalCard
          data={cardDatas.df3}
          heading={"Recent Movies"}
          flash={false}
        />
        <HorizontalCard
          data={cardDatas.df2}
          heading={"Biography Movies"}
          flash={false}
        />
        <HorizontalCard
          data={cardDatas.df4}
          heading={"Animation Movies"}
          flash={false}
        />
        <HorizontalCard
          data={cardDatas.df5}
          heading={"Popular Indian Movies"}
          flash={false}
        />
      </div>
    );
  }
};

export default Home;
