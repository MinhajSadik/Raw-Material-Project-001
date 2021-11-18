package main

import (
	"SEEN-TECH-VAI21-BACKEND-GO/DBManager"
	"SEEN-TECH-VAI21-BACKEND-GO/Routes"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/pprof"
)

func SetupRoutes(app *fiber.App) {
	Routes.MaterialRoute(app.Group("/material"))
	Routes.UnitsOfMeasurementRoute(app.Group("/units_of_measurement"))
}

func main() {

	fmt.Println(("Hello SEEN-TECH-CHIR"))
	fmt.Print("Initializing Database Connection ... ")
	initState := DBManager.InitCollections()

	if initState {
		fmt.Println("[OK]")
	} else {
		fmt.Println("[FAILED]")
		return
	}

	fmt.Print("Initializing the server ... ")
	app := fiber.New()
	app.Use(cors.New())
	app.Use(pprof.New())
	SetupRoutes(app)
	app.Static("/", "./Public")
	fmt.Println("[OK]")
	app.Listen(":8080")

}
