import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
class Card extends React.Component {
    render() {
        const tableData = this.props.data.d;
        const rows = tableData.map((row) => {
            console.log(row);
            const cells = row.map((cell) => {
                return <td>{cell}</td>;
            });
            return <tr>{cells}</tr>;
        });
        return (
            <div className="card">
                <div className="details">
                    <div className="heading">{this.props.data.heading}</div>
                    <table>{rows}</table>
                </div>
                <div className="btn"></div>
            </div>
        );
    }
}
class Pair extends React.Component {
    render() {
        let { data } = this.props;
        data ||= {
            chainId: "bsc",
            dexId: "pancakeswap",
            url: "https://dexscreener.com/bsc/0xd0e226f674bbf064f54ab47f42473ff80db98cba",
            pairAddress: "0xD0e226f674bBf064f54aB47F42473fF80DB98CBA",
            labels: ["v3"],
            baseToken: {
                address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
                name: "Ethereum Token",
                symbol: "ETH",
            },
            quoteToken: {
                address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                name: "Wrapped BNB",
                symbol: "WBNB",
            },
            priceNative: "7.6452",
            priceUsd: "1653.043",
            txns: {
                h1: { buys: 33, sells: 17 },
                h24: { buys: 906, sells: 755 },
                h6: { buys: 141, sells: 153 },
                m5: { buys: 6, sells: 0 },
            },
            volume: { h24: 4904613.47, h6: 787802.92, h1: 134504.75, m5: 5729.49 },
            priceChange: { h1: 0.02, h24: -0.94, h6: -0.05, m5: 0.01 },
            liquidity: { usd: 1972110.14, base: 708.3086, quote: 3705.7112 },
            fdv: 1000071549,
            pairCreatedAt: 1680536288000,
        };
        const info = {
            heading: "Basic Info",
            d: [
                ["Pair Created At", data.pairCreatedAt],
                ["Symbol", data.baseToken.symbol],
                ["Dex ID", data.dexId],
                ["Pair Address", data.pairAddress],
            ],
        };
        const baseToken = {
            heading: "Base Token",
            d: [
                ["Name", data.baseToken.name],
                ["Symbol", data.baseToken.symbol],
                ["Address", data.baseToken.address],
            ],
        };

        const quoteToken = {
            heading: "Quote Token",
            d: [
                ["Name", data.quoteToken.name],
                ["Symbol", data.quoteToken.symbol],
                ["Address", data.quoteToken.address],
            ],
        };
        const price = {
            heading: "Price",
            d: [
                ["Price Native", data.priceNative],
                ["Price USD", data.priceUsd],
            ],
        };
        return (
            <div className="pair">
                <Card data={info}></Card>
                <Card data={baseToken}></Card>
                <Card data={quoteToken}></Card>
                <Card data={price}></Card>
            </div>
        );
    }
}
class SearchForm extends React.Component {
    state = {
        pairs: <Pair></Pair>,
    };
    handleChange = (event) => {
        const { value } = event.target;
        if (value.length > 1) this.updateResults(value);
    };

    updateResults(searchTerm) {
        const inst = this;
        console.log(searchTerm);
        let url =
            this.props.type === "token"
                ? "https://api.dexscreener.com/latest/dex/tokens/" + searchTerm
                : "https://api.dexscreener.com/latest/dex/search/?q=" + searchTerm;
        console.log(url);
        fetch(url)
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                console.log(result);
                if (result.pairs === null) {
                    inst.setState({
                        pairs: (
                            <div style={{ color: "#fff" }}>No matching Result Found.</div>
                        ),
                    });
                    return;
                }
                if (inst.props.type) {
                    result.pairs.sort(function (a, b) {
                        return b.priceUsd - a.priceUsd;
                    });
                }
                result.pairs = result.pairs.slice(0, 10);
                const pairs = result.pairs.map((pairData) => {
                    return <Pair data={pairData}></Pair>;
                });
                inst.setState({
                    pairs: pairs,
                });
            });
    }
    render() {
        return (
            <div>
                <form className="search-container">
                    <input
                        name="search"
                        className="search-box"
                        onChange={this.handleChange}
                        placeholder="Search"
                    />
                    <div className="empty"></div>
                    <ConnectButton label="Connect"></ConnectButton>
                </form>
                <div className="results-container">
                    <div className="heading"></div>
                    <div className="results">{this.state.pairs}</div>
                </div>
            </div>
        );
    }
}

export default class App extends React.Component {
    state = {
        searchType: "pair",
    };
    changeSearchType = (event) => {
        this.setState({
            searchType: event.target.getAttribute("data-type"),
        });
    };
    render() {
        return (
            <div className="fc">
                <div className="top-pane">
                    <div className="left-pane">
                        <div className="logo">NFTify</div>
                        <div
                            data-type="token"
                            className={
                                "searchToggle " +
                                (this.state.searchType === "token" ? "selected" : "")
                            }
                            onClick={this.changeSearchType}
                        >
                            Token Address
                        </div>
                        <div
                            data-type="pair"
                            className={
                                "searchToggle " +
                                (this.state.searchType === "pair" ? "selected" : "")
                            }
                            onClick={this.changeSearchType}
                        >
                            Pair Address
                        </div>
                    </div>
                    <div className="right-pane">
                        <SearchForm type={this.state.searchType}></SearchForm>
                    </div>
                </div>
                <div className="bottom-strip"></div>
            </div>
        );
    }
}
