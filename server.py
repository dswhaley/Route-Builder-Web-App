from app import create_app
# construct an app using the default config options
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
