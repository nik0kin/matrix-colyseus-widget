import * as React from 'react';

export interface Props {
  totalTicks: number;
}

export class WaitingIndicator extends React.Component {
  private interval: NodeJS.Timer;

  constructor(props: Props) {
    super(props);
    this.state = { totalTicks: 0 };
  }

  tick() {
    this.setState((prevState: Props) => ({
      totalTicks: prevState.totalTicks + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="waiting-indicator"> {getWaitingIndicator(false, (this.state as Props).totalTicks)} </div>
    );
  }
}


function getWaitingIndicator(yourTurn: boolean, seconds: number) {
  if (yourTurn) {
    return <span>...</span>;
  } else {
    const indicatorString: string = '  Waiting on Opponent  ';

    const num: number = seconds % indicatorString.length;

    return <span>{indicatorString.substring(num, num + 5)}</span>;
  }
}
