import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive sizing charts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="mens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mens">Men's</TabsTrigger>
            <TabsTrigger value="womens">Women's</TabsTrigger>
            <TabsTrigger value="footwear">Footwear</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mens" className="space-y-4">
            <div>
              <h3 className="mb-4">Men's Clothing Size Chart</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (inches)</TableHead>
                    <TableHead>Waist (inches)</TableHead>
                    <TableHead>Hip (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>XS</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>26-28</TableCell>
                    <TableCell>33-35</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>S</TableCell>
                    <TableCell>35-37</TableCell>
                    <TableCell>29-31</TableCell>
                    <TableCell>36-38</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>39-41</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L</TableCell>
                    <TableCell>41-43</TableCell>
                    <TableCell>35-37</TableCell>
                    <TableCell>42-44</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XL</TableCell>
                    <TableCell>44-46</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>45-47</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XXL</TableCell>
                    <TableCell>47-49</TableCell>
                    <TableCell>41-43</TableCell>
                    <TableCell>48-50</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="pt-4">
              <h4 className="mb-2">How to Measure</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
                <li><strong>Hip:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="womens" className="space-y-4">
            <div>
              <h3 className="mb-4">Women's Clothing Size Chart</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Bust (inches)</TableHead>
                    <TableHead>Waist (inches)</TableHead>
                    <TableHead>Hip (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>XS</TableCell>
                    <TableCell>31-32</TableCell>
                    <TableCell>24-25</TableCell>
                    <TableCell>34-35</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>S</TableCell>
                    <TableCell>33-34</TableCell>
                    <TableCell>26-27</TableCell>
                    <TableCell>36-37</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M</TableCell>
                    <TableCell>35-36</TableCell>
                    <TableCell>28-29</TableCell>
                    <TableCell>38-39</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L</TableCell>
                    <TableCell>37-39</TableCell>
                    <TableCell>30-32</TableCell>
                    <TableCell>40-42</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XL</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>33-35</TableCell>
                    <TableCell>43-45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XXL</TableCell>
                    <TableCell>43-45</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>46-48</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="pt-4">
              <h4 className="mb-2">How to Measure</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape horizontal.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline, at the narrowest point.</li>
                <li><strong>Hip:</strong> Measure around the fullest part of your hips, about 8 inches below your waist.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="footwear" className="space-y-4">
            <div>
              <h3 className="mb-4">Footwear Size Chart</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-2">Men's Shoes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>US Size</TableHead>
                        <TableHead>EU Size</TableHead>
                        <TableHead>UK Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>7</TableCell>
                        <TableCell>40</TableCell>
                        <TableCell>6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>8</TableCell>
                        <TableCell>41</TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>9</TableCell>
                        <TableCell>42</TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>10</TableCell>
                        <TableCell>43</TableCell>
                        <TableCell>9</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>11</TableCell>
                        <TableCell>44</TableCell>
                        <TableCell>10</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>12</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>11</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="mb-2">Women's Shoes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>US Size</TableHead>
                        <TableHead>EU Size</TableHead>
                        <TableHead>UK Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>5</TableCell>
                        <TableCell>35</TableCell>
                        <TableCell>3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>6</TableCell>
                        <TableCell>36</TableCell>
                        <TableCell>4</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>7</TableCell>
                        <TableCell>37</TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>8</TableCell>
                        <TableCell>38</TableCell>
                        <TableCell>6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>9</TableCell>
                        <TableCell>39</TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>10</TableCell>
                        <TableCell>40</TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="mb-2">How to Measure Your Feet</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Stand on a piece of paper with your heel against a wall.</li>
                <li>Mark the longest part of your foot on the paper.</li>
                <li>Measure the distance from the wall to the mark.</li>
                <li>Use the measurement to find your size in the chart above.</li>
                <li>If you're between sizes, we recommend ordering the larger size.</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Sizes may vary slightly between brands. If you're unsure about your size, 
            please contact our customer service team for personalized assistance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}