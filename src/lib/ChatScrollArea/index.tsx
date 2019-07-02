import * as React from 'react';
import classnames from 'classnames';

export interface ChatScrollAreaStyles {
  container?: React.CSSProperties;
}

export interface ChatScrollAreaClasses {
  container?: string;
}

const chatScrollAreaStyles: ChatScrollAreaStyles = {
  container: {
    overflow: 'auto',
    padding: '0 10px'
    // flexDirection: 'column-reverse'
  }
};

export interface ChatScrollAreaProps {
  maxHeight?: string | number;
  minHeight?: string | number;
  children?: JSX.Element | JSX.Element[];
  styles?: ChatScrollAreaStyles;
  apiRef?: (api: ChatScrollAreaApi) => void;
  loadOldMessagesThreshold: number;
  onLoadOldMessages: () => Promise<void>;

  style?: React.CSSProperties;
  className?: string;
  classes?: ChatScrollAreaClasses;
}

export interface ChatScrollAreaApi {
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  scrollTo: (top: number) => void;
  scrollTop: () => number;
  scrollHeight: () => number;
  clientHeight: () => number;
  scrolledToBottom: () => boolean;
  scrolledToLoadThreshold: () => boolean; // Check if we are scrolled to threshold where we need to load messages
}

export class ChatScrollArea extends React.Component<ChatScrollAreaProps> {
  scrollContainer: HTMLDivElement;
  constructor(props: ChatScrollAreaProps) {
    super(props);
  }

  public render() {
    let { styles, classes } = this.props;
    if (!styles) {
      styles = {};
    }
    if (!classes) {
      classes = {};
    }
    const { container } = styles;
    return (
      <div
        ref={scrollContainer => {
          this.scrollContainer = scrollContainer;
          this.props.apiRef &&
            this.props.apiRef({
              scrollToBottom: (behavior = 'auto') =>
                scrollContainer &&
                (scrollContainer.scrollTo
                  ? scrollContainer.scrollTo({
                      top: scrollContainer.scrollHeight,
                      behavior
                    })
                  : (scrollContainer.scrollTop = scrollContainer.scrollHeight)),
              scrollTo: top =>
                scrollContainer &&
                (scrollContainer.scrollTo
                  ? scrollContainer.scrollTo({
                      top: top
                    })
                  : (scrollContainer.scrollTop = top)),
              scrolledToBottom: () =>
                this.scrollContainer.clientHeight +
                  this.scrollContainer.scrollTop ===
                this.scrollContainer.scrollHeight,
              scrolledToLoadThreshold: () =>
                this.scrollContainer &&
                this.scrollContainer.scrollTop <=
                  this.props.loadOldMessagesThreshold,
              scrollTop: () =>
                this.scrollContainer && this.scrollContainer.scrollTop,
              scrollHeight: () =>
                this.scrollContainer && this.scrollContainer.scrollHeight,
              clientHeight: () =>
                this.scrollContainer && this.scrollContainer.clientHeight
            });
        }}
        className={classnames(
          'react-bell-chat__chat-scroll-area',
          this.props.className,
          classes.container
        )}
        style={{
          ...chatScrollAreaStyles.container,
          ...(this.props.maxHeight !== undefined
            ? { maxHeight: this.props.maxHeight }
            : {}),
          ...(this.props.minHeight !== undefined
            ? { minHeight: this.props.minHeight }
            : {}),
          ...container,
          ...this.props.style
        }}
        onScroll={e =>
          this.scrollContainer &&
          this.scrollContainer.scrollTop <=
            this.props.loadOldMessagesThreshold &&
          this.props.onLoadOldMessages()
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export default ChatScrollArea;
