import React from "react";
import styled from "styled-components";
import { sortBy } from "lodash";
import { StyledButton } from "./StyledButton";
import { Story } from "./StoryTypes";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCheckSquare,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faCheckSquare, faSortAmountDown, faSortAmountUp);

//#region Styles
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  span:first-child {
    text-align: left;
  }
`;

const StyledColumn = styled.span<{ width: string }>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const SortButton = styled.button`
  cursor: pointer;
  font-family: "Iceberg", cursive;
  box-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  text-shadow: 0px 0px 0px transparent;
  border-radius: 8px;
  width: 100%;

  &:focus {
    outline: none;
  }
  &:hover {
    background: #a741a7;
  }
  &.ascending::after {
    content: "🔼";
    display: inline-block;
  }
  &.descending::after {
    content: "🔽";
    display: inline-block;
  }
`;
//#endregion

//#region types
type Stories = Array<Story>;
type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

interface Sort {
  [key: string]: (list: Stories) => Stories;
}
//#endregion

const SORTS: Sort = {
  NONE: (list: Stories) => list,
  TITLE: (list: Stories) => sortBy(list, "title"),
  AUTHOR: (list: Stories) => sortBy(list, "author"),
  COMMENT: (list: Stories) => sortBy(list, "num_comments").reverse(),
  POINT: (list: Stories) => sortBy(list, "points").reverse(),
};

//#region components
export const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState({ sortKey: "NONE", isReverse: false });
  const handleSort = (sortkey: string) => {
    const isReverse = sort.sortKey === sortkey && !sort.isReverse;
    setSort({ sortKey: sortkey, isReverse: isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);
  //console.log(sort.sortKey);
  const getClassName =
    sort.sortKey !== "NONE" && sort.isReverse
      ? "ascending"
      : sort.sortKey !== "NONE" && !sort.isReverse
      ? "descending"
      : "";

  return (
    <div>
      <StyledItem style={{ fontWeight: "bold" }}>
        <StyledColumn width="40%">
          <SortButton
            type="button"
            className={sort.sortKey === "TITLE" ? getClassName : ""}
            onClick={() => handleSort("TITLE")}
          >
            Title:
          </SortButton>
        </StyledColumn>
        <StyledColumn width="30%">
          <SortButton
            type="button"
            className={sort.sortKey === "AUTHOR" ? getClassName : ""}
            onClick={() => handleSort("AUTHOR")}
          >
            Author:
          </SortButton>
        </StyledColumn>
        <StyledColumn width="10%">
          <SortButton
            type="button"
            className={sort.sortKey === "COMMENT" ? getClassName : ""}
            onClick={() => handleSort("COMMENT")}
          >
            Comments:
          </SortButton>
        </StyledColumn>
        <StyledColumn width="10%">
          <SortButton
            type="button"
            className={sort.sortKey === "POINT" ? getClassName : ""}
            onClick={() => handleSort("POINT")}
          >
            Points:
          </SortButton>
        </StyledColumn>
        <StyledColumn width="10%">Remove:</StyledColumn>
      </StyledItem>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </div>
  );
};

export const Item = ({ item, onRemoveItem }: ItemProps) => (
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        data-testid="dismiss-button"
        type="button"
        onClick={() => onRemoveItem(item)}
      >
        <FontAwesomeIcon icon="check-square" size="1x" />
        {/* <Check height="18px" width="18px" /> */}
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);
//#endregion
