import React from 'react';
import IAReactComponent from './IAReactComponent';
import {AnchorDetails} from '@internetarchive/ia-components/index.js';
import ArchiveMember from "@internetarchive/dweb-archivecontroller/ArchiveMember.js";

/*
    List of collections on details page]
    Its passed a list of collections, and mapping to titles.
    If titles arent supplied it will attempt to find through ArchiveMember.expand so dependend on ArchiveMember if not supplying titles.

    <DetailsCollectionList collections=["prelinger"*]  collectionTitles={prelinger: "Prelinger Archives"} />

    TODO - Isa wants this collection to be passed the collectionTitles already expanded,
    TODO - since caller is Details.js which is FakeReact and doesnt rerender this will have to wait until something above this is React and therefore r-rendering

 */
export default class DetailsCollectionList extends IAReactComponent {
  constructor(props) {
    super(props); // collections
    this.state.collectionTitles = (typeof this.props.collectionTitles === 'undefined') ? {} : this.props.collectionTitles;
    this.state.expansionTried = false;
  }

  loadcallable(unused_enclosingElement) {
    // expand a list of collections into a list of titles either through collectionTitles if supplied (e.g. from dweb gateway) or via a new Search query
    const { ArchiveMemberExpand, collections } = this.props;
    if (!this.state.expansionTried) {
      this.state.expansionTried = true;
      ArchiveMember.expand(collections.filter(k => !this.state.collectionTitles[k]), (err, res) => { // res = { id: AS(id) }
        const collectionTitles = Object.assign({}, this.state.collectionTitles, Object.map(res, (k, v) => [k, v.title]));
        this.setState({ collectionTitles });
      });
    }
  }

  render() {
    return (
      <div className="boxy collection-list">
        <section className="quick-down collection-list" ref={this.load}>
          <h5 className="collection-title">IN COLLECTIONS</h5>
          {this.props.collections.map(collection => (
            <div className="collection-item" key={collection}>
              <AnchorDetails
                identifier={collection}
                data-event-click-tracking={`CollectionList|${collection}`}
              >
                {this.state.collectionTitles[collection] || collection}
              </AnchorDetails>
            </div>
          ))}
        </section>
      </div>
    );
  }
}
