import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { icons, kinds } from 'Helpers/Props';
import formatDate from 'Utilities/Date/formatDate';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import SpinnerButton from 'Components/Link/SpinnerButton';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import PageContent from 'Components/Page/PageContent';
import PageContentBodyConnector from 'Components/Page/PageContentBodyConnector';
import UpdateChanges from './UpdateChanges';
import styles from './Updates.css';

class Updates extends Component {

  //
  // Render

  render() {
    const {
      currentVersion,
      isFetching,
      isPopulated,
      error,
      items,
      isInstallingUpdate,
      isDocker,
      shortDateFormat,
      onInstallLatestPress
    } = this.props;

    const hasUpdates = isPopulated && !error && items.length > 0;
    const noUpdates = isPopulated && !error && !items.length;
    const hasUpdateToInstall = hasUpdates && _.some(items, { installable: true, latest: true });
    const noUpdateToInstall = hasUpdates && !hasUpdateToInstall;

    return (
      <PageContent title="Updates">
        <PageContentBodyConnector>
          {
            !isPopulated && !error &&
              <LoadingIndicator />
          }

          {
            noUpdates &&
              <div>No updates are available</div>
          }

          {
            hasUpdateToInstall &&
              <div className={styles.updateAvailable}>
                {
                  !isDocker &&
                  <SpinnerButton
                    className={styles.updateAvailable}
                    kind={kinds.PRIMARY}
                    isSpinning={isInstallingUpdate}
                    onPress={onInstallLatestPress}
                  >
                    Install Latest
                  </SpinnerButton>
                }

                {
                  isDocker &&
                    <div className={styles.upToDateMessage}>
                      An update is available.  Please update your Docker image and re-create the container.
                    </div>
                }

                {
                  isFetching &&
                    <LoadingIndicator
                      className={styles.loading}
                      size={20}
                    />
                }
              </div>
          }

          {
            noUpdateToInstall &&
              <div className={styles.upToDate}>
                <Icon
                  className={styles.upToDateIcon}
                  name={icons.CHECK_CIRCLE}
                  size={30}
                />
                <div className={styles.upToDateMessage}>
                  The latest version of Readarr is already installed
                </div>

                {
                  isFetching &&
                    <LoadingIndicator
                      className={styles.loading}
                      size={20}
                    />
                }
              </div>
          }

          {
            hasUpdates &&
              <div>
                {
                  items.map((update) => {
                    const hasChanges = !!update.changes;

                    return (
                      <div
                        key={update.version}
                        className={styles.update}
                      >
                        <div className={styles.info}>
                          <div className={styles.version}>{update.version}</div>
                          <div className={styles.space}>&mdash;</div>
                          <div className={styles.date}>{formatDate(update.releaseDate, shortDateFormat)}</div>

                          {
                            update.branch === 'master' ?
                              null :
                              <Label
                                className={styles.label}
                              >
                                {update.branch}
                              </Label>
                          }

                          {
                            update.version === currentVersion ?
                              <Label
                                className={styles.label}
                                kind={kinds.SUCCESS}
                              >
                                Currently Installed
                              </Label> :
                              null
                          }
                        </div>

                        {
                          !hasChanges &&
                            <div>Maintenance release</div>
                        }

                        {
                          hasChanges &&
                            <div className={styles.changes}>
                              <UpdateChanges
                                title="New"
                                changes={update.changes.new}
                              />

                              <UpdateChanges
                                title="Fixed"
                                changes={update.changes.fixed}
                              />
                            </div>
                        }
                      </div>
                    );
                  })
                }
              </div>
          }

          {
            !!error &&
              <div>
                Failed to fetch updates
              </div>
          }
        </PageContentBodyConnector>
      </PageContent>
    );
  }

}

Updates.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.array.isRequired,
  isInstallingUpdate: PropTypes.bool.isRequired,
  isDocker: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  onInstallLatestPress: PropTypes.func.isRequired
};

export default Updates;
