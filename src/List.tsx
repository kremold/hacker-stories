import styled from "styled-components";
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
//#endregion

//#region components
export const List = ({ list, onRemoveItem }: ListProps) => (
  <>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
    ;
  </>
);

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
