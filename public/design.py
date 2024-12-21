import logging
from PyQt5.QtWidgets import (
    QLabel,
    QLineEdit,
    QPushButton,
    QVBoxLayout,
    QHBoxLayout,
    QRadioButton,
    QButtonGroup,
    QWidget,
)
from PyQt5.QtGui import QFont
from PyQt5.QtCore import Qt
import os

# Suppress Qt warnings related to fonts (including EUDC.TTE)
logging.getLogger("PyQt5.Qt").setLevel(logging.ERROR)


class Design(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Excel Updater | Adding Places 😸📌🗺️")
        self.setStyleSheet(
            "background-color: #3b3f45; color: #ffffff;"
        )  # Dark background with white text

        # Use a commonly available font like Arial
        font = QFont("Arial", 12, QFont.Bold)

        self.title = QLabel("Add Places to the map 😸📌🗺️📸")
        self.title.setFont(QFont("Arial", 18, QFont.Bold))  # Bigger title font
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet(
            "color: #ffeb3b;"
        )  # Yellow color for title to make it stand out

        # Name Input Section
        self.name_label = QLabel("🌍 Name:")
        self.name_label.setFont(font)
        self.name_input = QLineEdit()
        self.name_input.setStyleSheet(
            "background-color: #ffffff; color: #000000; border-radius: 8px; padding: 10px;"
        )

        # Coordinates Input Section
        self.coords_label = QLabel("📍 Coords:")
        self.coords_label.setFont(font)
        self.coords_input = QLineEdit()
        self.coords_input.setStyleSheet(
            "background-color: #ffffff; color: #000000; border-radius: 8px; padding: 10px;"
        )

        # Image Link Input Section
        self.image_links_label = QLabel("🌐 Image Link:")
        self.image_links_label.setFont(font)
        self.image_links_input = QLineEdit()
        self.image_links_input.setStyleSheet(
            "background-color: #ffffff; color: #000000; border-radius: 8px; padding: 10px;"
        )

        # Radio Buttons for Selecting Sheet
        self.sheet_label = QLabel("🗂️ Select Sheet:")
        self.sheet_label.setFont(font)

        self.visited_radio = QRadioButton("🚩 Visited")
        self.visited_radio.setFont(
            QFont("Arial", 14)
        )  # Larger font for radio button text
        self.visited_radio.setStyleSheet(
            "color: #ffffff; padding: 10px; margin-right: 20px; font-weight: bold;"
        )
        self.visited_radio.setChecked(True)

        self.planned_radio = QRadioButton("✈️ Planned")
        self.planned_radio.setFont(
            QFont("Arial", 14)
        )  # Larger font for radio button text
        self.planned_radio.setStyleSheet(
            "color: #ffffff; padding: 10px; margin-right: 20px; font-weight: bold;"
        )

        self.sheet_group = QButtonGroup()
        self.sheet_group.addButton(self.visited_radio)
        self.sheet_group.addButton(self.planned_radio)

        self.sheet_layout = QHBoxLayout()
        self.sheet_layout.addWidget(self.visited_radio)
        self.sheet_layout.addWidget(self.planned_radio)

        # Action Button to Add Data to Excel
        self.add_button = QPushButton("🖱️ Add to Excel")
        self.add_button.setFont(
            QFont("Arial", 14, QFont.Bold)
        )  # Bigger font for button text
        self.add_button.setStyleSheet(
            "background-color: #7289da; color: #ffffff; border-radius: 15px; padding: 15px; min-width: 250px;"
        )

        # Action Button to Open Excel
        self.open_excel_button = QPushButton("🖱️ Open Excel")
        self.open_excel_button.setFont(
            QFont("Arial", 14, QFont.Bold)
        )  # Bigger font for button text
        self.open_excel_button.setStyleSheet(
            "background-color: #7289da; color: #ffffff; border-radius: 15px; padding: 15px; min-width: 250px;"
        )

        # Connect the "Open Excel" button to a function
        self.open_excel_button.clicked.connect(self.open_excel)

        # Message Label
        self.message_label = QLabel("")
        self.message_label.setFont(font)
        self.message_label.setStyleSheet("color: #ffcc00;")  # Yellow text for warnings
        self.message_label.setAlignment(Qt.AlignCenter)

        # Add the cursor style to make the elements clickable (hand cursor)
        self.add_button.setCursor(Qt.PointingHandCursor)
        self.open_excel_button.setCursor(Qt.PointingHandCursor)
        self.visited_radio.setCursor(Qt.PointingHandCursor)
        self.planned_radio.setCursor(Qt.PointingHandCursor)

        # Layout for the form
        self.layout = QVBoxLayout()
        self.layout.setContentsMargins(20, 20, 20, 20)  # Add margins around the layout
        self.layout.setSpacing(15)  # Add spacing between widgets

        # Add title with spacing at the top
        self.layout.addWidget(self.title)

        self.form_layout = QVBoxLayout()
        self.form_layout.setSpacing(10)  # Spacing between form inputs

        self.form_layout.addWidget(self.name_label)
        self.form_layout.addWidget(self.name_input)
        self.form_layout.addWidget(self.coords_label)
        self.form_layout.addWidget(self.coords_input)
        self.form_layout.addWidget(self.image_links_label)
        self.form_layout.addWidget(self.image_links_input)
        self.form_layout.addWidget(self.sheet_label)
        self.form_layout.addLayout(self.sheet_layout)

        self.layout.addLayout(self.form_layout)

        # Add action buttons (Add to Excel and Open Excel) with more space
        self.layout.addWidget(self.add_button)
        self.layout.addWidget(self.open_excel_button)

        # Add message label with some space below
        self.layout.addWidget(self.message_label)

        self.setLayout(self.layout)

    def open_excel(self):
        # Function to open the Excel file
        file_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "data.xlsx"
        )
        try:
            os.startfile(
                file_path
            )  # This opens the file with the default Excel application
        except Exception as e:
            self.show_message(f"Failed to open Excel file: {e}", error=True)

    def show_message(self, message, error=False):
        """
        Display a message on the GUI window.
        :param message: The message to display.
        :param error: If True, show the message as an error (red text).
        """
        self.message_label.setText(message)
        self.message_label.setStyleSheet(
            "color: #ff5555;"
            if error
            else "color: #55ff55;"  # Red for errors, green for success
        )
