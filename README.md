# Unix Timestamp Hover

[日本語 README](README.ja.md)

A VS Code extension that displays a human-readable date tooltip when hovering over a Unix timestamp.

## Features

- **Hover to Convert**: Simply hover your mouse cursor over a Unix timestamp to see the converted date and time.
- **Supports Multiple Formats**: Automatically detects:
  - Seconds (10 digits)
  - Milliseconds (13 digits)
  - Microseconds (16 digits)
  - Nanoseconds (19 digits)
- **Customizable Timezone**: Set your preferred timezone (default: `Asia/Tokyo`).
- **Customizable Date Format**: Define how the date should be displayed (default: `YYYY/MM/DD HH:mm:ss`).

## Extension Settings

This extension contributes the following settings:

* `timestampHover.timezone`: The timezone to use for displaying the date (e.g., `Asia/Tokyo`, `UTC`, `America/New_York`). Default is `Asia/Tokyo`.
* `timestampHover.format`: The format string for the date.
    * Available placeholders:
        * `YYYY`: Year
        * `MM`: Month
        * `DD`: Day
        * `HH`: Hour
        * `mm`: Minute
        * `ss`: Second
        * `SSS`: Milliseconds
    * Default is `YYYY/MM/DD HH:mm:ss`.

## Usage

1. Open any file containing Unix timestamps.
2. Hover over a number like `1700000000` or `1700000000000`.
3. A tooltip will appear showing the formatted date.

## Known Issues

- Only supports numeric strings that match the specific digit counts (10, 13, 16, 19).
- Validates years between 1970 and 2100 to avoid false positives.

## Release Notes

### 0.1.0

- Initial release of Unix Timestamp Hover.
- Added support for seconds, milliseconds, microseconds, and nanoseconds.
- Added configuration for timezone and date format.
