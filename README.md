# slack-filter-bots [![In Chrome Webstore][button-install]][store-link]

[![Do stuff][button-version]][store-link]
[![Github issues][shieldio-issues]][github-issues]
[![Github forks][shieldio-forks]][github-link]
[![Github stars][shieldio-stars]][github-link]
[![Github license][shieldio-license]][github-link]

Do you love slack? Do you love how it gathers all information in one place? Do you heavily use integrations to keep up to speed with version control, project management, continuous integration, ...?

I do too! But sometimes, those integration messages get in the way of what's really important: communicating as a team.

That's why I developed this extension. It inserts a 'filter' function into slack's channels and allows you to toggle the visibility of all those 'bot' messages. (Ironically: slackbot is not considered to be a bot :p)

This allows you to focus on what the actual humans are saying.


(Filtering is enabled/disabled on a per-domain, per-channel basis.)

## Changelog
 * 0.2.5:
   - Fix for changes in slack layout (relative positioning ipo absolute)
   - Restructured code to make future change adjustments easier.
 * 0.2.4: Fix for change in slack layout (class renaming)
 * 0.2.3:
    - Added a README on the github page
    - Adjusted to match the new styling of Slack
 * 0.2.2:
    - Made it work in un-chromed windows (e.g. when launching from desktop shortcut).
    - Fixed bug when navigating to https://domain.slack.com instead of https://domain.slack.com/messages/channel directly.
 * 0.2.1: (Un)hides the toggle when going in and out of direct-message channels.
 * 0.2.0: Makes the toggle always appear next to the 'members' button.
 * 0.1.0: First release

[store-link]:       https://chrome.google.com/webstore/detail/slack-bot-filter/blephhkggdennbfmdcjmlfimedknghfc
[github-link]:      https://github.com/call-a3/slack-filter-bots/issues
[github-issues]:    https://github.com/call-a3/slack-filter-bots/issues
[shieldio-issues]:  https://img.shields.io/github/issues/call-a3/slack-filter-bots.svg
[shieldio-forks]:   https://img.shields.io/github/forks/call-a3/slack-filter-bots.svg
[shieldio-stars]:   https://img.shields.io/github/stars/call-a3/slack-filter-bots.svg
[shieldio-license]: https://img.shields.io/github/license/call-a3/slack-filter-bots.svg
[button-version]:   https://img.shields.io/badge/version-0.2.5-blue.svg
[button-install]:   https://cdn.rawgit.com/call-a3/slack-filter-bots/7f62431f0d3e460b23e34b87a9bcb27fca0edaba/install-button.svg
