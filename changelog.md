## 1.2.6

- Revert stupidity _note to self, stop trying to do UI stuff..._

## 1.2.5

- Fix eventlisteners for "new" updates

## 1.2.4

- Better handling of adding eventlisteners

## 1.2.3

- Adds issue button to card-editor

## 1.2.2

- Remove export

## 1.2.1

- Remove paper-input import

## 1.2.0

- Merge files to solve FF import error.

## 1.1.1

- Styling changes [#44](https://github.com/custom-cards/tracker-card/pull/44) [(@bbbenji)](https://github.com/bbbenji)

## 1.1.0

- Added support to update single element

**NB! Clicking the red version number when there is an update will now install that update instead of taking you to the release notes, for release notes click the name of that element.**

## 1.0.0

- Added (limited) UI editor inspiration from [roku-card-editor.js](https://github.com/custom-cards/roku-card/blob/master/roku-card-editor.js) by [@iantrich](https://github.com/iantrich)
- type changed from `js` to `module`

```yaml
resources:
  - url: /customcards/github/custom-components/tracker-card.js?track=true
    type: module
```

- `sensor.custom_card_tracker` and `sensor.custom_component_tracker` are both enabled by default.

## 0.3.1 - 0.3.2

- Fix buttons after 0.88.x

## 0.3.0

- Don't show icon if custom name is set.

## 0.2.0

- Added custom string translation for:
  ```
  name_text: Name (default)
  current_text: Current (default)
  available_text: Available (default)
  update_all_text: Update all (default)
  check_text: Check (default)
  ```

## 0.1.5

- Added exception for has_update

## 0.1.4

- Set a static domain for services
- Added exception for `hidden`

## 0.1.3

- Added support for the new `custom_updater`
- Added new linktypes

## 0.1.2

Fixed color when using themes

## 0.1.1

Added repo link to all names

## 0.1.0

- Renamed to tracker-card
- Added support for custom_components as well
- Added support for multiple `check`/`update` services
- Add support for multiple type of tracking & updating components
- Configuration breaking change:

```yaml
- type: custom:tracker-card
  title:
  trackers:
    - sensor.custom_card_tracker
    - sensor.custom_component_tracker
```

## 0.0.3

Implemented exception for `homebridge_hidden`

## 0.0.2

Removed obsolete console.log

## 0.0.1

Initial release that supports versioning
