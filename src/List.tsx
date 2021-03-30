import React from "react";
import styled from "styled-components";
import { sortBy } from "lodash";
import { StyledButton } from "./StyledButton";
import { Story, Stories } from "./StoryTypes";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faCheckSquare);

//#region Styles
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span<{ width: string }>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;
//#endregion

//#region types
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
  const [sort, setSort] = React.useState("NONE");
  const handleSort = (sortKey: string) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
    <div>
      <StyledItem style={{ fontWeight: "bold" }}>
        <StyledColumn width="40%">
          <button type="button" onClick={() => handleSort("TITLE")}>
            Title:
          </button>
        </StyledColumn>
        <StyledColumn width="30%">
          <button type="button" onClick={() => handleSort("AUTHOR")}>
            Author:
          </button>
        </StyledColumn>
        <StyledColumn width="10%">
          <button type="button" onClick={() => handleSort("COMMENT")}>
            Comments Count:
          </button>
        </StyledColumn>
        <StyledColumn width="10%">
          <button type="button" onClick={() => handleSort("POINT")}>
            Points:
          </button>
        </StyledColumn>
        <StyledColumn width="10%">Remove:</StyledColumn>
      </StyledItem>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
      ;
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
